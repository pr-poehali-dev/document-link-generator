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

def draw_logo(c, logo_data: str, x: float, y: float, max_width: float = 30*mm, max_height: float = 15*mm):
    try:
        from reportlab.lib.utils import ImageReader
        if logo_data.startswith('data:image'):
            logo_data = logo_data.split(',')[1]
        
        img_bytes = base64.b64decode(logo_data)
        img = ImageReader(BytesIO(img_bytes))
        
        iw, ih = img.getSize()
        aspect = ih / float(iw)
        
        if iw > max_width / (1/72*25.4):
            iw = max_width / (1/72*25.4)
            ih = iw * aspect
        
        if ih > max_height / (1/72*25.4):
            ih = max_height / (1/72*25.4)
            iw = ih / aspect
        
        c.drawImage(img, x, y, width=iw*72/25.4*mm, height=ih*72/25.4*mm, mask='auto')
    except:
        pass

def draw_signature(c, sig_data: str, x: float, y: float, max_width: float = 40*mm, max_height: float = 15*mm):
    try:
        from reportlab.lib.utils import ImageReader
        if sig_data.startswith('data:image'):
            sig_data = sig_data.split(',')[1]
        
        img_bytes = base64.b64decode(sig_data)
        img = ImageReader(BytesIO(img_bytes))
        
        iw, ih = img.getSize()
        aspect = ih / float(iw)
        
        if iw > max_width / (1/72*25.4):
            iw = max_width / (1/72*25.4)
            ih = iw * aspect
        
        if ih > max_height / (1/72*25.4):
            ih = max_height / (1/72*25.4)
            iw = ih / aspect
        
        c.drawImage(img, x, y, width=iw*72/25.4*mm, height=ih*72/25.4*mm, mask='auto')
    except:
        pass

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

def draw_shield_icon(c, x, y):
    from reportlab.lib.colors import HexColor
    blue_dark = HexColor('#1e40af')
    blue_light = HexColor('#3b82f6')
    green = HexColor('#10b981')
    
    c.setStrokeColor(blue_dark)
    c.setFillColor(blue_light)
    c.setLineWidth(1.5)
    
    points = [
        (x + 7.5*mm, y + 20*mm),
        (x + 15*mm, y + 16*mm),
        (x + 15*mm, y + 6*mm),
        (x + 7.5*mm, y),
        (x, y + 6*mm),
        (x, y + 16*mm)
    ]
    
    path = c.beginPath()
    path.moveTo(points[0][0], points[0][1])
    for point in points[1:]:
        path.lineTo(point[0], point[1])
    path.close()
    c.drawPath(path, fill=1, stroke=1)
    
    c.setFillColor(green)
    c.setLineWidth(2)
    c.setStrokeColor(HexColor('#ffffff'))
    c.line(x + 3*mm, y + 10*mm, x + 6*mm, y + 7*mm)
    c.line(x + 6*mm, y + 7*mm, x + 12*mm, y + 14*mm)

def draw_money_icon(c, x, y):
    from reportlab.lib.colors import HexColor
    blue_dark = HexColor('#1e40af')
    blue_light = HexColor('#3b82f6')
    gold = HexColor('#fbbf24')
    
    c.setStrokeColor(blue_dark)
    c.setFillColor(gold)
    c.setLineWidth(1.5)
    
    c.rect(x, y + 8*mm, 15*mm, 10*mm, fill=1, stroke=1)
    
    c.setFillColor(blue_light)
    c.circle(x + 7.5*mm, y + 13*mm, 3*mm, fill=1, stroke=0)
    
    c.setStrokeColor(HexColor('#ffffff'))
    c.setLineWidth(1.2)
    c.line(x + 7.5*mm, y + 15*mm, x + 7.5*mm, y + 11*mm)
    c.line(x + 6*mm, y + 13*mm, x + 9*mm, y + 13*mm)

def create_loan_agreement(logo: str = None, signature: str = None, client_data: Dict[str, str] = None) -> bytes:
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
    
    if logo:
        draw_logo(c, logo, width - 70*mm, height - 25*mm)
    else:
        draw_document_icon(c, 35*mm, height - 45*mm)
    
    y = height - 25*mm
    c.setFillColor(blue_dark)
    c.setFont(font_name, 20)
    c.drawString(60*mm, y, "ДОГОВОР ЗАЙМА")
    
    from datetime import datetime
    current_date = datetime.now()
    date_str = current_date.strftime('%d.%m.%Y')
    day = current_date.strftime('%d')
    month_names = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    month = month_names[current_date.month - 1]
    year = current_date.strftime('%Y')
    
    y = height - 65*mm
    c.setFillColor(gray_text)
    c.setFont(font_name, 11)
    c.drawString(30*mm, y, "г. Москва")
    c.drawRightString(width - 30*mm, y, f"«{day}» {month} {year} г.")
    y -= 15*mm
    
    c.setFont(font_name, 10)
    c.setFillColor(gray_text)
    
    if not client_data:
        client_data = {}
    
    full_name = client_data.get('fullName', '________________________________')
    birth_date = client_data.get('birthDate', '__.__.____ г.р.')
    if birth_date and birth_date != '__.__.____ г.р.' and '-' in birth_date:
        parts = birth_date.split('-')
        birth_date = f"{parts[2]}.{parts[1]}.{parts[0]} г.р."
    
    passport = f"{client_data.get('passportSeries', '____')} {client_data.get('passportNumber', '______')}"
    amount = client_data.get('amount', '_____________')
    term = client_data.get('term', '__')
    phone = client_data.get('phone', '_________________')
    email = client_data.get('email', '_________________')
    
    from datetime import datetime, timedelta
    if term and term != '__':
        try:
            return_date = datetime.now() + timedelta(days=int(term))
            return_date_str = return_date.strftime('%d.%m.%Y')
        except:
            return_date_str = '«__» __________ 20__ г.'
    else:
        return_date_str = '«__» __________ 20__ г.'
    
    interest_amount = ''
    total_amount = ''
    if amount and amount != '_____________' and term and term != '__':
        try:
            loan_amount = float(amount)
            loan_days = int(term)
            interest = loan_amount * loan_days * 0.01
            total = loan_amount + interest
            interest_amount = f"{interest:,.2f}".replace(',', ' ')
            total_amount = f"{total:,.2f}".replace(',', ' ')
        except:
            pass
    
    text_lines = [
        ("normal", "Самозанятый Малик Степан Владимирович, ИНН 503303222876,"),
        ("normal", "именуемый в дальнейшем «Займодавец», с одной стороны, и"),
        ("normal", f"{full_name}, именуемый в дальнейшем «Заемщик»,"),
        ("normal", f"паспорт {passport}, дата рождения {birth_date},"),
        ("normal", "с другой стороны, заключили настоящий договор о нижеследующем:"),
        ("space", ""),
        ("header", "1. ПРЕДМЕТ ДОГОВОРА"),
        ("space", ""),
        ("normal", "1.1. Займодавец передает в собственность Заемщику денежные средства"),
        ("normal", f"в сумме {amount} рублей (заем), а Заемщик обязуется вернуть"),
        ("normal", "заем и уплатить проценты на него в сроке и в порядке, которые"),
        ("normal", "предусмотрены настоящим договором."),
        ("space", ""),
        ("header", "2. УСЛОВИЯ ЗАЙМА"),
        ("space", ""),
        ("normal", f"2.1. Сумма займа: {amount} рублей."),
        ("normal", f"2.2. Срок возврата займа: до {return_date_str}."),
        ("normal", f"2.3. Срок займа: {term} дней."),
        ("normal", "2.4. Проценты за пользование займом: 1% в день."),
    ]
    
    if interest_amount and total_amount:
        text_lines.extend([
            ("normal", f"2.5. Сумма процентов за весь период: {interest_amount} рублей."),
            ("normal", f"2.6. ИТОГО К ВОЗВРАТУ: {total_amount} рублей."),
        ])
    
    text_lines.extend([
        ("space", ""),
        ("header", "3. КОНТАКТНЫЕ ДАННЫЕ ЗАЙМОДАВЦА"),
        ("space", ""),
        ("contact", "Адрес: г. Москва, улица маршала Жукова, дом 53, офис 183"),
        ("contact", "Телефон: +7 (499) 273-38-29"),
        ("contact", "ИНН: 503303222876"),
        ("space", ""),
        ("header", "4. КОНТАКТНЫЕ ДАННЫЕ ЗАЕМЩИКА"),
        ("space", ""),
        ("contact", f"ФИО: {full_name}"),
        ("contact", f"Паспорт: {passport}"),
        ("contact", f"Дата рождения: {birth_date}"),
        ("contact", f"Телефон: {phone}"),
        ("contact", f"Email: {email}"),
        ("space", ""),
        ("header", "5. ПРАВА И ОБЯЗАННОСТИ СТОРОН"),
        ("space", ""),
        ("normal", "5.1. Займодавец обязуется передать сумму займа в срок,"),
        ("normal", "указанный в п. 1.1 настоящего договора."),
        ("space", ""),
        ("normal", "5.2. Заемщик обязуется:"),
        ("normal", "  • вернуть полученные денежные средства в установленный срок;"),
        ("normal", "  • уплатить проценты за пользование займом."),
        ("space", ""),
        ("header", "6. ПОДПИСИ СТОРОН"),
        ("space", ""),
        ("normal", "Займодавец: " + ("" if signature else "_________________") + " / Малик С.В. /"),
        ("normal", f"Дата подписания: {date_str}"),
        ("space", ""),
        ("normal", f"Заемщик: _________________ / {full_name} /"),
        ("normal", f"Дата подписания: {date_str}")
    ])
    
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
    
    if signature:
        draw_signature(c, signature, 45*mm, 32*mm)
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def create_consent_form(logo: str = None, signature: str = None, client_data: Dict[str, str] = None) -> bytes:
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
    
    if logo:
        draw_logo(c, logo, width - 70*mm, height - 25*mm)
    else:
        draw_shield_icon(c, 35*mm, height - 45*mm)
    
    y = height - 25*mm
    c.setFillColor(blue_dark)
    c.setFont(font_name, 18)
    c.drawString(60*mm, y, "СОГЛАСИЕ НА ОБРАБОТКУ")
    y -= 7*mm
    c.drawString(60*mm, y, "ПЕРСОНАЛЬНЫХ ДАННЫХ")
    
    y = height - 65*mm
    c.setFont(font_name, 10)
    c.setFillColor(gray_text)
    
    if not client_data:
        client_data = {}
    
    full_name = client_data.get('fullName', '________________________________________')
    phone = client_data.get('phone', '_________________')
    email = client_data.get('email', '_________________')
    
    from datetime import datetime
    current_date = datetime.now().strftime('%d.%m.%Y')
    
    text_lines = [
        ("normal", f"Я, {full_name},"),
        ("space", ""),
        ("normal", "в соответствии с требованиями ст. 9 Федерального закона"),
        ("normal", "от 27.07.2006 № 152-ФЗ «О персональных данных» даю согласие"),
        ("normal", "самозанятому Малик Степану Владимировичу (ИНН 503303222876)"),
        ("normal", "на обработку моих персональных данных."),
        ("space", ""),
        ("header", "Цель обработки персональных данных:"),
        ("normal", "  • заключение и исполнение договоров"),
        ("normal", "  • ведение бухгалтерского и налогового учета"),
        ("normal", "  • информирование о новых услугах"),
        ("space", ""),
        ("header", "Перечень персональных данных:"),
        ("normal", "  • фамилия, имя, отчество"),
        ("normal", "  • дата рождения"),
        ("normal", "  • адрес регистрации и фактического проживания"),
        ("normal", "  • контактные телефоны"),
        ("normal", "  • адрес электронной почты"),
        ("normal", "  • паспортные данные"),
        ("space", ""),
        ("normal", "Согласие дается на период действия договорных отношений"),
        ("normal", "и 5 (пять) лет после их окончания."),
        ("space", ""),
        ("header", "Контактные данные оператора:"),
        ("contact", "ФИО: Малик Степан Владимирович"),
        ("contact", "ИНН: 503303222876"),
        ("contact", "Адрес: г. Москва, улица маршала Жукова, дом 53, офис 183"),
        ("contact", "Телефон: +7 (499) 273-38-29"),
        ("space", ""),
        ("header", "Мои контактные данные:"),
        ("contact", f"Телефон: {phone}"),
        ("contact", f"Email: {email}"),
        ("space", ""),
        ("normal", f"Дата: {current_date}"),
        ("space", ""),
        ("normal", "Подпись: " + ("" if signature else "_________________") + f" / {full_name} /")
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
    
    if signature:
        draw_signature(c, signature, 45*mm, 32*mm)
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

def create_refund_policy(logo: str = None, signature: str = None, client_data: Dict[str, str] = None) -> bytes:
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
    
    if logo:
        draw_logo(c, logo, width - 70*mm, height - 25*mm)
    else:
        draw_money_icon(c, 35*mm, height - 45*mm)
    
    y = height - 25*mm
    c.setFillColor(blue_dark)
    c.setFont(font_name, 20)
    c.drawString(60*mm, y, "ВОЗВРАТ ПЛАТЕЖЕЙ")
    
    y = height - 65*mm
    c.setFont(font_name, 10)
    c.setFillColor(gray_text)
    
    if not client_data:
        client_data = {}
    
    full_name = client_data.get('fullName', '')
    phone = client_data.get('phone', '')
    email = client_data.get('email', '')
    
    text_lines = [
        ("contact", "Самозанятый: Малик Степан Владимирович"),
        ("contact", "ИНН: 503303222876"),
        ("contact", "Адрес: г. Москва, улица маршала Жукова, дом 53, офис 183"),
        ("contact", "Телефон: +7 (499) 273-38-29"),
        ("space", ""),
    ]
    
    if full_name:
        text_lines.extend([
            ("header", "ДАННЫЕ КЛИЕНТА:"),
            ("contact", f"ФИО: {full_name}"),
            ("contact", f"Телефон: {phone}"),
            ("contact", f"Email: {email}"),
        ])
    
    text_lines.extend([
        ("space", ""),
        ("header", "1. ОСНОВАНИЕ ДЛЯ ВОЗВРАТА"),
        ("space", ""),
        ("normal", "1.1. Возврат платежей осуществляется в следующих случаях:"),
        ("normal", "  • ошибочного зачисления средств"),
        ("normal", "  • ненадлежащего исполнения обязательств"),
        ("normal", "  • в других случаях, предусмотренных законодательством РФ"),
        ("space", ""),
        ("header", "2. ПОРЯДОК ОФОРМЛЕНИЯ ВОЗВРАТА"),
        ("space", ""),
        ("normal", "2.1. Для оформления возврата необходимо:"),
        ("normal", "  • написать заявление на возврат с указанием основания"),
        ("normal", "  • приложить копии подтверждающих документов"),
        ("normal", "  • указать реквизиты для перечисления средств"),
        ("space", ""),
        ("normal", "2.2. Заявление можно подать:"),
        ("normal", "  • лично по адресу: г. Москва, ул. маршала Жукова, д. 53, оф. 183"),
        ("normal", "  • по телефону: +7 (499) 273-38-29"),
        ("space", ""),
        ("header", "3. СРОКИ ВОЗВРАТА"),
        ("space", ""),
        ("normal", "3.1. Рассмотрение заявления: до 10 рабочих дней"),
        ("normal", "3.2. Перечисление средств: до 10 рабочих дней после принятия"),
        ("normal", "положительного решения"),
        ("space", ""),
        ("header", "4. СПОСОБЫ ВОЗВРАТА"),
        ("space", ""),
        ("normal", "4.1. Возврат осуществляется тем же способом, которым был"),
        ("normal", "проведен платеж, если иное не предусмотрено законодательством"),
        ("normal", "или соглашением сторон."),
        ("space", ""),
        ("normal", "4.2. По желанию заказчика возврат может быть осуществлен"),
        ("normal", "на банковский счет при предоставлении соответствующих реквизитов."),
        ("space", ""),
        ("header", "5. ОТВЕТСТВЕННОСТЬ СТОРОН"),
        ("space", ""),
        ("normal", "5.1. За необоснованный отказ в возврате средств самозанятый"),
        ("normal", "несет ответственность в соответствии с законодательством РФ."),
        ("space", ""),
        ("normal", "5.2. Заказчик несет ответственность за предоставление"),
        ("normal", "недостоверной информации при оформлении заявления на возврат."),
        ("space", ""),
        ("space", ""),
        ("normal", "Данные условия действуют с момента публикации и до их изменения.")
    ])
    
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
    
    if signature:
        draw_signature(c, signature, 45*mm, 32*mm)
    
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
    logo = params.get('logo')
    signature = params.get('signature')
    
    client_data = {
        'fullName': params.get('fullName', ''),
        'birthDate': params.get('birthDate', ''),
        'passportSeries': params.get('passportSeries', ''),
        'passportNumber': params.get('passportNumber', ''),
        'amount': params.get('amount', ''),
        'term': params.get('term', ''),
        'phone': params.get('phone', ''),
        'email': params.get('email', '')
    }
    
    if doc_type == 'loan':
        pdf_content = create_loan_agreement(logo, signature, client_data)
        filename = 'dogovor-zajma.pdf'
    elif doc_type == 'consent':
        pdf_content = create_consent_form(logo, signature, client_data)
        filename = 'soglasie-na-obrabotku-dannyh.pdf'
    elif doc_type == 'refund':
        pdf_content = create_refund_policy(logo, signature, client_data)
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