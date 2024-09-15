import qrcode
import os
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
import json

def generate_qr_code(data, qr_filename):
    qr = qrcode.QRCode(
        version=8,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=40,
        border=0,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(qr_filename)


def overlay_qr_code(certificate, text, qr_code, output_filename):
    cert_name_center = 1750
    
    draw = ImageDraw.Draw(certificate)
    font_path = "baskervi.ttf"
    # font_path = "BASKRV_L.ttf"
    font = ImageFont.truetype(font_path, 90)
    text_width= font.getlength(text)
    text_position = (cert_name_center - text_width // 2, 1169)
    color = "#4c0d82"
    draw.text(text_position, text, fill=color, font=font)
    qr_position = (1550, 1720)
    qr_code = qr_code.resize((399, 399))
    qr_alpha = qr_code.convert("RGBA").split()[3]
    qr_overlay = Image.new("RGBA", certificate.size, (0, 0, 0, 0))
    qr_overlay.paste(qr_code, qr_position, qr_alpha)
    result = Image.alpha_composite(certificate.convert("RGBA"), qr_overlay)
    result.save(output_filename)

# from PIL import Image, ImageDraw, ImageFont

# def overlay_qr_code(certificate, text, qr_code, output_filename):
#     cert_name_center = 2079

#     draw = ImageDraw.Draw(certificate)
#     font_path = "BASKRV_L.ttf"
#     font = ImageFont.truetype(font_path, 90)
#     text_width = font.getlength(text)
#     text_position = (cert_name_center - text_width // 2, 1239)
#     color = "black"

#     # Simulate bold by drawing the text multiple times with larger offsets
#     offsets = [(0, 0), (1, 0), (0, 1), (1, 1), (2, 0), (0, 2), (2, 1), (1, 2), (2, 2)]
#     for offset in offsets:
#         pos = (text_position[0] + offset[0], text_position[1] + offset[1])
#         draw.text(pos, text, fill=color, font=font)

#     qr_position = (1550, 1769)
#     qr_code = qr_code.resize((399, 399))
#     qr_alpha = qr_code.convert("RGBA").split()[3]
#     qr_overlay = Image.new("RGBA", certificate.size, (0, 0, 0, 0))
#     qr_overlay.paste(qr_code, qr_position, qr_alpha)
#     result = Image.alpha_composite(certificate.convert("RGBA"), qr_overlay)
#     result.save(output_filename)


if __name__ == "__main__":
    base_url = "https://cbitosc.github.io/verify24/reactfastapibootcampFM/?id="
    template_filename = "ReactJSandFastAPIbootcamp/4.png"
    output_directory = "ReactJS and FastAPI Bootcamp Merit with QR Female"
    excel_file = "ReactJSandFastAPIbootcamp/workingsheetMeritFemale.xlsx"
    df = pd.read_excel(excel_file)
    os.makedirs(output_directory, exist_ok=True)
    all_certificates_data = []
    certificate_template = Image.open(template_filename)
    codes_start_number = 10
    for index, row in df.iterrows():
        name = row['Name']
        fname = ' '.join(''.join((word[i].upper() if (i == 0 or (i < len(word) - 1 and word[i-1] == '.')) else char.lower()) for i, char in enumerate(word)) for word in name.split())
        department = row['Department']
        code = fname.lower().replace(" ", "").replace(".", "")+"RFBM"+str(index+codes_start_number).zfill(4)
        qr_data = base_url + code
        qr_filename = "qr_code.png"
        generate_qr_code(qr_data, qr_filename)
        qr_code = Image.open(qr_filename)
        # overlay_text = f"{fname} of {department} Department"
        overlay_text = row["Holder"]
        output_filename = os.path.join(output_directory, f"{fname}.png")
        overlay_qr_code(certificate_template.copy(), overlay_text, qr_code, output_filename)
        certificate_data = {
            "code": code, 
            "holder": overlay_text,
        }
        all_certificates_data.append(certificate_data)
        print(f"Certificate with QR code and text for {name} saved as {output_filename}")
    all_certificates_json_filename = os.path.join("DataRBFFM.json")
    with open(all_certificates_json_filename, 'w') as json_file:
        json.dump(all_certificates_data, json_file, indent=2)
    print(f"All certificates data saved to {all_certificates_json_filename}")
