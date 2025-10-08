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

def create_loan_agreement() -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    has_font = register_fonts()
    font_name = 'OpenSans' if has_font else 'Helvetica'
    
    y = height - 40*mm
    
    c.setFont(font_name, 16)
    c.drawCentredString(width/2, y, "ДОГОВОР ЗАЙМА")
    y -= 15*mm
    
    c.setFont(font_name, 11)
    c.drawString(30*mm, y, "г. Москва")
    c.drawRightString(width - 30*mm, y, "«__» __________ 20__ г.")
    y -= 10*mm
    
    c.setFont(font_name, 10)
    
    text_lines = [
        "",
        "Самозанятый Малик Степан Владимирович, ИНН 503303222876,",
        "именуемый в дальнейшем «Займодавец», с одной стороны, и",
        "________________________________, именуемый в дальнейшем «Заемщик»,",
        "с другой стороны, заключили настоящий договор о нижеследующем:",
        "",
        "1. ПРЕДМЕТ ДОГОВОРА",
        "",
        "1.1. Займодавец передает в собственность Заемщику денежные средства",
        "в сумме _____________ рублей (заем), а Заемщик обязуется вернуть",
        "заем и уплатить проценты на него в сроке и в порядке, которые",
        "предусмотрены настоящим договором.",
        "",
        "2. УСЛОВИЯ ЗАЙМА",
        "",
        "2.1. Сумма займа: _____________ рублей.",
        "2.2. Срок возврата займа: до «__» __________ 20__ г.",
        "2.3. Проценты за пользование займом: ___% годовых.",
        "",
        "3. КОНТАКТНЫЕ ДАННЫЕ ЗАЙМОДАВЦА",
        "",
        "Адрес: г. Москва, улица маршала Жукова, дом 53, офис 183",
        "Телефон: +7 (499) 273-38-29",
        "ИНН: 503303222876",
        "",
        "4. ПРАВА И ОБЯЗАННОСТИ СТОРОН",
        "",
        "4.1. Займодавец обязуется передать сумму займа в срок,",
        "указанный в п. 1.1 настоящего договора.",
        "",
        "4.2. Заемщик обязуется:",
        "- вернуть полученные денежные средства в установленный срок;",
        "- уплатить проценты за пользование займом.",
        "",
        "5. ПОДПИСИ СТОРОН",
        "",
        "Займодавец: _________________ / Малик С.В. /",
        "",
        "Заемщик: _________________ / _____________ /"
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
