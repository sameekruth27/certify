# Certificate Generation and Verification System

This project is a comprehensive system for generating and verifying certificates. It consists of a FastAPI backend and a React frontend. The backend handles certificate generation based on user-provided templates and data, while the frontend provides a user-friendly interface for uploading and managing certificates. The system also supports QR code generation and verification.

## Features

- **Certificate Generation**: Users can upload a certificate template and an Excel file containing recipient data. The system generates personalized certificates with QR codes.
- **QR Code Generation**: Each certificate includes a unique QR code linking to the certificate's information.
- **Certificate Verification**: Users can upload certificates to verify their authenticity by scanning the QR code embedded in the certificate.
- **Dynamic Data Handling**: Generates JSON data based on the generated certificates for record-keeping or further processing.

## Technologies Used

- **Frontend**: React, Chakra UI, Axios, React Dropzone, XLSX
- **Backend**: FastAPI, Python Imaging Library (PIL), qrcode, pandas, pyzbar
- **Database**: No database; uses file-based storage for certificates and JSON data
- **Deployment**: Can be deployed on any server that supports Python and Node.js

## Installation

### Backend

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

3. Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the required Node.js packages:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

## API Endpoints

- **POST** `/api/generate-certificates`: Uploads certificate template and Excel file, generates certificates, and returns a success message.
- **POST** `/api/upload-certificate`: Uploads a certificate image for verification, scans the QR code, and returns the QR code data.
- **GET** `/api/python`: Simple endpoint to check server status (returns "Hello World").

## Usage

### Generate Certificates

1. Go to the React frontend page to upload a certificate template and an Excel file.
2. Fill out the required fields and click "Generate Certificates."
3. The system will process the data, generate certificates, and save them to the specified output directory.

### Verify Certificates

1. Navigate to the verification page in the React frontend.
2. Upload the certificate image.
3. The system will scan the QR code and display the associated data.

## Contributing

Contributions are welcome! Please submit a pull request with your changes or open an issue for discussion.
