'''
Business: Генерирует PDF документы с реквизитами самозанятого на русском языке
Args: event с httpMethod и queryStringParameters (type: loan/consent/refund)
Returns: PDF файл для скачивания с поддержкой кириллицы
'''

import json
from typing import Dict, Any
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
import base64
import urllib.request

def register_fonts():
    try:
        url = "https://github.com/google/fonts/raw/main/ofl/opensans/OpenSans%5Bwdth%2Cwght%5D.ttf"
        response = urllib.request.urlopen(url)
        font_data = response.read()
        
        font_file = BytesIO(font_data)
        pdfmetrics.registerFont(TTFont('OpenSans', font_file))
        return True
    except:
        return False

def draw_header_decoration(c, width, height):
    from reportlab.lib.colors import HexColor
    blue_dark = HexColor('#1e40af')
    blue_light = HexColor('#3b82f6')
    blue_bg = HexColor('#eff6ff')
    
    c.setFillColor(blue_bg)
    c.rect(0, height - 60*mm, width, 60*mm, fill=1, stroke=0)
    
    c.setFillColor(blue_dark)
    c.circle(width - 40*mm, height - 30*mm, 25*mm, fill=1, stroke=0)
    
    c.setFillColor(blue_light)
    c.circle(width - 45*mm, height - 35*mm, 20*mm, fill=1, stroke=0)
    
    c.setStrokeColor(blue_light)
    c.setLineWidth(2)
    c.line(30*mm, height - 55*mm, width - 30*mm, height - 55*mm)
    
    c.setFillColor(blue_dark)
    c.rect(25*mm, height - 50*mm, 8*mm, 8*mm, fill=1, stroke=0)
    c.setFillColor(blue_light)
    c.circle(33*mm, height - 42*mm, 3*mm, fill=1, stroke=0)

def draw_document_icon(c, x, y):
    from reportlab.lib.colors import HexColor
    blue_dark = HexColor('#1e40af')
    blue_light = HexColor('#3b82f6')
    
    c.setStrokeColor(blue_dark)
    c.setFillColor(blue_light)
    c.setLineWidth(1.5)
    
    c.rect(x, y, 15*mm, 20*mm, fill=1, stroke=1)
    
    c.setStrokeColor(HexColor('#ffffff'))
    c.setLineWidth(0.8)
    c.line(x + 3*mm, y + 15*mm, x + 12*mm, y + 15*mm)
    c.line(x + 3*mm, y + 11*mm, x + 12*mm, y + 11*mm)
    c.line(x + 3*mm, y + 7*mm, x + 12*mm, y + 7*mm)
    
    c.setFillColor(HexColor('#fbbf24'))
    c.circle(x + 12*mm, y + 18*mm, 2*mm, fill=1, stroke=0)

def create_loan_agreement() -> bytes:
    from reportlab.lib.colors import HexColor
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    has_font = register_fonts()
    font_name = 'OpenSans' if has_font else 'Helvetica'
    
    blue_dark = HexColor('#1e40af')
    blue_text = HexColor('#1e3a8a')
    gray_text = HexColor('#374151')
    
    draw_header_decoration(c, width, height)
    
    draw_document_icon(c, 35*mm, height - 45*mm)
    
    y = height - 25*mm
    c.setFillColor(blue_dark)
    c.setFont(font_name, 20)
    c.drawString(60*mm, y, "ДОГОВОР ЗАЙМА")
    
    y = height - 65*mm
    c.setFillColor(gray_text)
    c.setFont(font_name, 11)
    c.drawString(30*mm, y, "г. Москва")
    c.drawRightString(width - 30*mm, y, "«__» __________ 20__ г.")
    y -= 15*mm
    
    c.setFont(font_name, 10)
    c.setFillColor(gray_text)
    
    text_lines = [
        ("normal", "Самозанятый Малик Степан Владимирович, ИНН 503303222876,"),
        ("normal", "именуемый в дальнейшем «Займодавец», с одной стороны, и"),
        ("normal", "________________________________, именуемый в дальнейшем «Заемщик»,"),
        ("normal", "с другой стороны, заключили настоящий договор о нижеследующем:"),
        ("space", ""),
        ("header", "1. ПРЕДМЕТ ДОГОВОРА"),
        ("space", ""),
        ("normal", "1.1. Займодавец передает в собственность Заемщику денежные средства"),
        ("normal", "в сумме _____________ рублей (заем), а Заемщик обязуется вернуть"),
        ("normal", "заем и уплатить проценты на него в сроке и в порядке, которые"),
        ("normal", "предусмотрены настоящим договором."),
        ("space", ""),
        ("header", "2. УСЛОВИЯ ЗАЙМА"),
        ("space", ""),
        ("normal", "2.1. Сумма займа: _____________ рублей."),
        ("normal", "2.2. Срок возврата займа: до «__» __________ 20__ г."),
        ("normal", "2.3. Проценты за пользование займом: ___% годовых."),
        ("space", ""),
        ("header", "3. КОНТАКТНЫЕ ДАННЫЕ ЗАЙМОДАВЦА"),
        ("space", ""),
        ("contact", "Адрес: г. Москва, улица маршала Жукова, дом 53, офис 183"),
        ("contact", "Телефон: +7 (499) 273-38-29"),
        ("contact", "ИНН: 503303222876"),
        ("space", ""),
        ("header", "4. ПРАВА И ОБЯЗАННОСТИ СТОРОН"),
        ("space", ""),
        ("normal", "4.1. Займодавец обязуется передать сумму займа в срок,"),
        ("normal", "указанный в п. 1.1 настоящего договора."),
        ("space", ""),
        ("normal", "4.2. Заемщик обязуется:"),
        ("normal", "  • вернуть полученные денежные средства в установленный срок;"),
        ("normal", "  • уплатить проценты за пользование займом."),
        ("space", ""),
        ("header", "5. ПОДПИСИ СТОРОН"),
        ("space", ""),
        ("normal", "Займодавец: _________________ / Малик С.В. /"),
        ("space", ""),
        ("normal", "Заемщик: _________________ / _____________ /")
    ]
    
    for line_type, line in text_lines:
        if y < 30*mm:
            c.showPage()
            y = height - 30*mm
        
        if line_type == "header":
            c.setFont(font_name, 11)
            c.setFillColor(blue_text)
            c.drawString(30*mm, y, line)
            c.setFont(font_name, 10)
            c.setFillColor(gray_text)
            y -= 6*mm
        elif line_type == "contact":
            c.setFillColor(blue_dark)
            c.drawString(30*mm, y, line)
            c.setFillColor(gray_text)
            y -= 5*mm
        elif line_type == "space":
            y -= 3*mm
        else:
            c.drawString(30*mm, y, line)
            y -= 5*mm
    
    c.setStrokeColor(HexColor('#3b82f6'))
    c.setLineWidth(1)
    c.line(30*mm, 25*mm, width - 30*mm, 25*mm)
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def create_consent_form() -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    has_font = register_fonts()
    font_name = 'OpenSans' if has_font else 'Helvetica'
    
    y = height - 40*mm
    
    c.setFont(font_name, 14)
    c.drawCentredString(width/2, y, "СОГЛАСИЕ НА ОБРАБОТКУ")
    y -= 7*mm
    c.drawCentredString(width/2, y, "ПЕРСОНАЛЬНЫХ ДАННЫХ")
    y -= 15*mm
    
    c.setFont(font_name, 10)
    
    text_lines = [
        "Я, ________________________________________,",
        "",
        "в соответствии с требованиями ст. 9 Федерального закона",
        "от 27.07.2006 № 152-ФЗ «О персональных данных» даю согласие",
        "самозанятому Малик Степану Владимировичу (ИНН 503303222876)",
        "на обработку моих персональных данных.",
        "",
        "Цель обработки персональных данных:",
        "- заключение и исполнение договоров",
        "- ведение бухгалтерского и налогового учета",
        "- информирование о новых услугах",
        "",
        "Перечень персональных данных, на обработку которых",
        "дается согласие:",
        "- фамилия, имя, отчество",
        "- дата рождения",
        "- адрес регистрации и фактического проживания",
        "- контактные телефоны",
        "- адрес электронной почты",
        "- паспортные данные",
        "",
        "Согласие дается на период действия договорных отношений",
        "и 5 (пять) лет после их окончания.",
        "",
        "Контактные данные оператора:",
        "ФИО: Малик Степан Владимирович",
        "ИНН: 503303222876",
        "Адрес: г. Москва, улица маршала Жукова, дом 53, офис 183",
        "Телефон: +7 (499) 273-38-29",
        "",
        "",
        "Дата: «__» __________ 20__ г.",
        "",
        "Подпись: _________________ / _________________ /"
    ]
    
    for line in text_lines:
        if y < 30*mm:
            c.showPage()
            y = height - 40*mm
            c.setFont(font_name, 10)
        c.drawString(30*mm, y, line)
        y -= 5*mm
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def create_refund_policy() -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    has_font = register_fonts()
    font_name = 'OpenSans' if has_font else 'Helvetica'
    
    y = height - 40*mm
    
    c.setFont(font_name, 14)
    c.drawCentredString(width/2, y, "ПОРЯДОК ВОЗВРАТА ПЛАТЕЖЕЙ")
    y -= 15*mm
    
    c.setFont(font_name, 10)
    
    text_lines = [
        "Самозанятый: Малик Степан Владимирович",
        "ИНН: 503303222876",
        "Адрес: г. Москва, улица маршала Жукова, дом 53, офис 183",
        "Телефон: +7 (499) 273-38-29",
        "",
        "1. ОСНОВАНИЕ ДЛЯ ВОЗВРАТА",
        "",
        "1.1. Возврат платежей осуществляется в следующих случаях:",
        "- ошибочного зачисления средств",
        "- ненадлежащего исполнения обязательств",
        "- в других случаях, предусмотренных законодательством РФ",
        "",
        "2. ПОРЯДОК ОФОРМЛЕНИЯ ВОЗВРАТА",
        "",
        "2.1. Для оформления возврата необходимо:",
        "- написать заявление на возврат с указанием основания",
        "- приложить копии подтверждающих документов",
        "- указать реквизиты для перечисления средств",
        "",
        "2.2. Заявление можно подать:",
        "- лично по адресу: г. Москва, ул. маршала Жукова, д. 53, оф. 183",
        "- по телефону: +7 (499) 273-38-29",
        "",
        "3. СРОКИ ВОЗВРАТА",
        "",
        "3.1. Рассмотрение заявления: до 10 рабочих дней",
        "3.2. Перечисление средств: до 10 рабочих дней после принятия",
        "положительного решения",
        "",
        "4. СПОСОБЫ ВОЗВРАТА",
        "",
        "4.1. Возврат осуществляется тем же способом, которым был",
        "проведен платеж, если иное не предусмотрено законодательством",
        "или соглашением сторон.",
        "",
        "4.2. По желанию заказчика возврат может быть осуществлен",
        "на банковский счет при предоставлении соответствующих реквизитов.",
        "",
        "5. ОТВЕТСТВЕННОСТЬ СТОРОН",
        "",
        "5.1. За необоснованный отказ в возврате средств самозанятый",
        "несет ответственность в соответствии с законодательством РФ.",
        "",
        "5.2. Заказчик несет ответственность за предоставление",
        "недостоверной информации при оформлении заявления на возврат.",
        "",
        "",
        "Данные условия действуют с момента публикации и до их изменения."
    ]
    
    for line in text_lines:
        if y < 30*mm:
            c.showPage()
            y = height - 40*mm
            c.setFont(font_name, 10)
        c.drawString(30*mm, y, line)
        y -= 5*mm
    
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
            'Content-Disposition': f'inline; filename="{filename}"',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        },
        'body': pdf_base64,
        'isBase64Encoded': True
    }