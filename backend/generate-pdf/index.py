'''
Business: Генерирует PDF документы с реквизитами самозанятого
Args: event с httpMethod и queryStringParameters (type: loan/consent/refund)
Returns: PDF файл для скачивания
'''

import json
from typing import Dict, Any
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from io import BytesIO
import base64

def create_loan_agreement() -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    y = height - 40*mm
    
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, y, "DOGOVOR ZAJMA")
    y -= 15*mm
    
    c.setFont("Helvetica", 11)
    c.drawString(30*mm, y, "Moskva")
    c.drawRightString(width - 30*mm, y, f"«__» __________ 20__ g.")
    y -= 10*mm
    
    c.setFont("Helvetica", 10)
    
    text_lines = [
        "",
        "Samozanyatyj Malik Stepan Vladimirovich, INN 503303222876,",
        "imenuemyj v dal'nejshem «Zajmodavec», s odnoj storony, i",
        "________________________________, imenuemyj v dal'nejshem «Zaemschik», s drugoj storony,",
        "zaklyuchili nastoyaschij dogovor o nizhe sleduyuschem:",
        "",
        "1. PREDMET DOGOVORA",
        "",
        "1.1. Zajmodavec peredaet v sobstvennost' Zaemschiku denezhnye sredstva",
        "v summe _____________ rublej (zaem), a Zaemschik obyazuetsya vozvrativ",
        "zaem i uplativ procenty na nego v sroke i v poryadke, kotorye predusmotreny",
        "nastoyaschim dogovorom.",
        "",
        "2. USLOVIYA ZAJMA",
        "",
        "2.1. Summa zajma: _____________ rublej.",
        "2.2. Srok vozvrta zajma: do «__» __________ 20__ g.",
        "2.3. Procenty za pol'zovanie zajmom: ___% godovyh.",
        "",
        "3. KONTAKTNYE DANNYE ZAJMODAVCA",
        "",
        "Adres: g. Moskva, ulica marshala Zhukova, dom 53, ofis 183",
        "Telefon: +7 (499) 273-38-29",
        "INN: 503303222876",
        "",
        "4. PODPISI STORON",
        "",
        "Zajmodavec: _________________ / Malik S.V. /",
        "",
        "Zaemschik: _________________ / _____________ /"
    ]
    
    for line in text_lines:
        c.drawString(30*mm, y, line)
        y -= 5*mm
        if y < 30*mm:
            c.showPage()
            y = height - 40*mm
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def create_consent_form() -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    y = height - 40*mm
    
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width/2, y, "SOGLASIE NA OBRABOTKU")
    y -= 7*mm
    c.drawCentredString(width/2, y, "PERSONAL'NYH DANNYH")
    y -= 15*mm
    
    c.setFont("Helvetica", 10)
    
    text_lines = [
        "Ya, ________________________________________,",
        "",
        "v sootvetstvii s trebovaniyami st. 9 Federal'nogo zakona ot 27.07.2006",
        "№ 152-FZ «O personal'nyh dannyh» dayu soglasie samozanyatomu",
        "Malik Stepanu Vladimirovichu (INN 503303222876) na obrabotku moih",
        "personal'nyh dannyh.",
        "",
        "Cel' obrabotki personal'nyh dannyh:",
        "- zaklyuchenie i ispolnenie dogovorov",
        "- vedenie buhgalterskogo i nalogovogo ucheta",
        "- informirovanie o novyh uslugah",
        "",
        "Perechen' personal'nyh dannyh, na obrabotku kotoryh",
        "daetsya soglasie:",
        "- familiya, imya, otchestvo",
        "- data rozhdeniya",
        "- adres registracii i fakticheskogo prozhivaniya",
        "- kontaktnye telefony",
        "- adres elektronnoj pochty",
        "- pasportnye dannye",
        "",
        "Soglasie daetsya na period dejstviya dogovornyh otnoshenij",
        "i 5 (pyat') let posle ih okonchaniya.",
        "",
        "Kontaktnye dannye operatora:",
        "Adres: g. Moskva, ulica marshala Zhukova, dom 53, ofis 183",
        "Telefon: +7 (499) 273-38-29",
        "",
        "",
        "Data: «__» __________ 20__ g.",
        "",
        "Podpis': _________________ / _________________ /"
    ]
    
    for line in text_lines:
        c.drawString(30*mm, y, line)
        y -= 5*mm
        if y < 30*mm:
            c.showPage()
            y = height - 40*mm
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def create_refund_policy() -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    y = height - 40*mm
    
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width/2, y, "PORYADOK VOZVRATA PLATEZHEJ")
    y -= 15*mm
    
    c.setFont("Helvetica", 10)
    
    text_lines = [
        "Samozanyatyj: Malik Stepan Vladimirovich",
        "INN: 503303222876",
        "Adres: g. Moskva, ulica marshala Zhukova, dom 53, ofis 183",
        "Telefon: +7 (499) 273-38-29",
        "",
        "1. OSNOVANIE DLYA VOZVRATA",
        "",
        "1.1. Vozvrat platezhej osuschestvlyaetsya v sleduyuschih sluchayah:",
        "- oshibochnogo zachisleniya sredstv",
        "- nenadlezhashchego ispolneniya obyazatel'stv",
        "- v drugih sluchayah, predusmotrenyh zakonodatel'stvom RF",
        "",
        "2. PORYADOK OFORMLENIYA VOZVRATA",
        "",
        "2.1. Dlya oformleniya vozvrata neobhodimo:",
        "- napisat' zayavlenie na vozvrat s ukazaniem osnovania",
        "- prilozhit' kopii podtverzhdayuschih dokumentov",
        "- ukazat' rekvizity dlya perechisleniya sredstv",
        "",
        "2.2. Zayavlenie mozhno podat':",
        "- lichno po adresu: g. Moskva, ul. marshala Zhukova, d. 53, of. 183",
        "- po telefonu: +7 (499) 273-38-29",
        "",
        "3. SROKI VOZVRATA",
        "",
        "3.1. Rassmotrenie zayavleniya: do 10 rabochih dnej",
        "3.2. Perechislenie sredstv: do 10 rabochih dnej posle prinyatiya",
        "polozitel'nogo resheniya",
        "",
        "4. SPOSOBY VOZVRATA",
        "",
        "4.1. Vozvrat osuschestvlyaetsya tem zhe sposobom, kotorym byl",
        "proveden platezh, esli inoe ne predusmotreno zakonodatel'stvom",
        "ili soglasheniem storon.",
        "",
        "4.2. Po zhelaniyu zakazchika vozvrat mozhet byt' osuchshestschvlen",
        "na bankovskij schet pri predostavlenii sootvetstvuyuschih rekvizitov.",
        "",
        "Dannye usloviya deystvuyut s momenta publikacii i do ih izmeneniya."
    ]
    
    for line in text_lines:
        c.drawString(30*mm, y, line)
        y -= 5*mm
        if y < 30*mm:
            c.showPage()
            y = height - 40*mm
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {})
    doc_type = params.get('type', 'loan')
    
    if doc_type == 'loan':
        pdf_content = create_loan_agreement()
        filename = 'dogovor-zajma.pdf'
    elif doc_type == 'consent':
        pdf_content = create_consent_form()
        filename = 'soglasie-na-obrabotku-dannyh.pdf'
    elif doc_type == 'refund':
        pdf_content = create_refund_policy()
        filename = 'vozvrat-platezhej.pdf'
    else:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid document type'})
        }
    
    pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/pdf',
            'Content-Disposition': f'attachment; filename="{filename}"',
            'Access-Control-Allow-Origin': '*'
        },
        'body': pdf_base64,
        'isBase64Encoded': True
    }
