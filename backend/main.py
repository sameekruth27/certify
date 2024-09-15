from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import pandas as pd
import os
import json

# FastAPI instance
app = FastAPI()

# CORS configuration (adjust for production as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint for root - to check if server is up
@app.get("/")
def read_root():
    return {"message": "Welcome to the Certificate Generation API"}

# Model for the certificate details
class CertificateResponse(BaseModel):
    message: str
    certificate_url: str

# POST method to upload the CSV file and generate certificates
@app.post("/generate/")
async def generate_certificates(
    file: UploadFile = File(...),
    certificate_template: UploadFile = File(...),
    base_link: str = Form(...)
):
    try:
        # Check file type
        if file.content_type != 'text/csv':
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")

        # Save files locally
        file_location = f"uploaded_files/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())

        template_location = f"uploaded_files/{certificate_template.filename}"
        with open(template_location, "wb+") as file_object:
            file_object.write(certificate_template.file.read())

        # Read the CSV file
        df = pd.read_csv(file_location)

        base_url = base_link
        template_filename = template_location
        output_directory = "static/generated_certificates/"
        os.makedirs(output_directory, exist_ok=True)

        certificate_template_img = Image.open(template_filename)
        codes_start_number = 1000

        all_certificates_data = []

        for index, row in df.iterrows():
            name = row['Name']
            fname = name.title()
            department = row['Department']
            code = fname.lower().replace(" ", "").replace(".", "") + "CERT" + str(index + codes_start_number).zfill(4)

            # QR code generation
            qr_data = base_url + code
            qr_filename = "static/qrcodes/" + f"{fname}_qr.png"
            # Implement generate_qr_code function in your qr_code_generator module
            generate_qr_code(qr_data, qr_filename)
            qr_code = Image.open(qr_filename)

            overlay_text = fname
            output_filename = os.path.join(output_directory, f"{fname}.png")
            # Implement overlay_qr_code function in your qr_code_generator module
            overlay_qr_code(certificate_template_img.copy(), overlay_text, qr_code, output_filename)

            certificate_data = {
                "name": name,
                "department": department,
                "code": code,
                "certificate_url": f"{base_url}{fname}.png"
            }
            all_certificates_data.append(certificate_data)

        # Save all certificate data to a JSON file
        with open('static/Data.json', 'w') as json_file:
            json.dump(all_certificates_data, json_file, indent=2)

        return {"message": "Certificates generated successfully", "data": all_certificates_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# Endpoint to serve certificate information
@app.get("/certificates/{certificate_code}", response_model=CertificateResponse)
async def get_certificate(certificate_code: str):
    try:
        # Load certificate data from JSON
        with open('static/Data.json') as json_file:
            certificates = json.load(json_file)

        # Find certificate by code
        certificate = next((item for item in certificates if item["code"] == certificate_code), None)
        if certificate:
            return {
                "message": "Certificate found",
                "certificate_url": certificate["certificate_url"]
            }
        else:
            raise HTTPException(status_code=404, detail="Certificate not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving certificate: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
