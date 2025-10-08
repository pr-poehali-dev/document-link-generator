import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const BASE_URL = "https://functions.poehali.dev/502d518c-5d60-4ce9-a293-c916a64f50db";

const documents = [
  {
    id: 1,
    title: "Договор займа",
    description: "Типовой договор займа с полным перечнем условий и обязательств сторон",
    url: `${BASE_URL}?type=loan`,
    icon: "FileText",
    type: "loan"
  },
  {
    id: 2,
    title: "Согласие на обработку персональных данных",
    description: "Документ о согласии на сбор и обработку персональных данных в соответствии с законодательством",
    url: `${BASE_URL}?type=consent`,
    icon: "Shield",
    type: "consent"
  },
  {
    id: 3,
    title: "Возврат платежей",
    description: "Порядок и условия возврата денежных средств согласно действующему законодательству",
    url: `${BASE_URL}?type=refund`,
    icon: "ArrowLeftRight",
    type: "refund"
  }
];

interface LoanFormData {
  fullName: string;
  birthDate: string;
  passportSeries: string;
  passportNumber: string;
  amount: string;
  term: string;
  phone: string;
  email: string;
}

interface ContactFormData {
  phone: string;
  email: string;
  fullName: string;
}

const Index = () => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [loanFormData, setLoanFormData] = useState<LoanFormData>({
    fullName: '',
    birthDate: '',
    passportSeries: '',
    passportNumber: '',
    amount: '',
    term: '',
    phone: '',
    email: ''
  });
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    phone: '',
    email: '',
    fullName: ''
  });

  const handleCopyLink = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на документ успешно скопирована в буфер обмена",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleView = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (url: string) => {
    let finalUrl = url;
    if (logo) {
      finalUrl += `&logo=${encodeURIComponent(logo)}`;
    }
    if (signature) {
      finalUrl += `&signature=${encodeURIComponent(signature)}`;
    }
    
    const link = document.createElement('a');
    link.href = finalUrl;
    link.download = '';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateDocument = (docType: string) => {
    const isLoan = docType === 'loan';
    const formData = isLoan ? loanFormData : contactFormData;
    
    if (isLoan) {
      if (!loanFormData.fullName || !loanFormData.birthDate || !loanFormData.passportSeries || 
          !loanFormData.passportNumber || !loanFormData.amount || !loanFormData.term || 
          !loanFormData.phone || !loanFormData.email) {
        toast({
          title: "Ошибка",
          description: "Заполните все поля формы",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!contactFormData.phone || !contactFormData.email || !contactFormData.fullName) {
        toast({
          title: "Ошибка",
          description: "Заполните все поля формы",
          variant: "destructive"
        });
        return;
      }
    }

    let url = `${BASE_URL}?type=${docType}`;
    
    if (isLoan) {
      url += `&fullName=${encodeURIComponent(loanFormData.fullName)}`;
      url += `&birthDate=${encodeURIComponent(loanFormData.birthDate)}`;
      url += `&passportSeries=${encodeURIComponent(loanFormData.passportSeries)}`;
      url += `&passportNumber=${encodeURIComponent(loanFormData.passportNumber)}`;
      url += `&amount=${encodeURIComponent(loanFormData.amount)}`;
      url += `&term=${encodeURIComponent(loanFormData.term)}`;
      url += `&phone=${encodeURIComponent(loanFormData.phone)}`;
      url += `&email=${encodeURIComponent(loanFormData.email)}`;
    } else {
      url += `&phone=${encodeURIComponent(contactFormData.phone)}`;
      url += `&email=${encodeURIComponent(contactFormData.email)}`;
      url += `&fullName=${encodeURIComponent(contactFormData.fullName)}`;
    }
    
    if (logo) {
      url += `&logo=${encodeURIComponent(logo)}`;
    }
    if (signature) {
      url += `&signature=${encodeURIComponent(signature)}`;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setOpenDialog(null);
    toast({
      title: "Документ сформирован",
      description: "PDF файл готов к скачиванию"
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        toast({
          title: "Логотип загружен",
          description: "Логотип будет добавлен в документы",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
        toast({
          title: "Подпись загружена",
          description: "Подпись будет добавлена в документы",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Юридические документы
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Скачайте необходимые документы или скопируйте ссылки для дальнейшего использования
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {documents.map((doc, index) => (
            <Card 
              key={doc.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0">
                  <Icon name={doc.icon as any} className="text-primary" size={32} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {doc.title}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {doc.description}
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Icon name="Link" size={16} className="text-gray-500 flex-shrink-0" />
                      <code className="text-sm text-gray-700 break-all flex-1">
                        {doc.url}
                      </code>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => handleView(doc.url)}
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                    >
                      <Icon name="Eye" size={18} />
                      Просмотр
                    </Button>
                    
                    <Button 
                      onClick={() => handleDownload(doc.url)}
                      variant="outline"
                      className="gap-2 border-2 hover:bg-gray-50"
                    >
                      <Icon name="Download" size={18} />
                      Скачать
                    </Button>

                    <Dialog open={openDialog === doc.type} onOpenChange={(open) => setOpenDialog(open ? doc.type : null)}>
                      <DialogTrigger asChild>
                        <Button 
                          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Icon name="FileEdit" size={18} />
                          Заполнить и отправить
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Заполнение данных для {doc.title.toLowerCase()}</DialogTitle>
                        </DialogHeader>
                        {doc.type === 'loan' ? (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="fullName">ФИО клиента</Label>
                                <Input 
                                  id="fullName" 
                                  value={loanFormData.fullName}
                                  onChange={(e) => setLoanFormData({...loanFormData, fullName: e.target.value})}
                                  placeholder="Иванов Иван Иванович"
                                />
                              </div>
                              <div>
                                <Label htmlFor="birthDate">Дата рождения</Label>
                                <Input 
                                  id="birthDate" 
                                  type="date"
                                  value={loanFormData.birthDate}
                                  onChange={(e) => setLoanFormData({...loanFormData, birthDate: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="passportSeries">Серия паспорта</Label>
                                <Input 
                                  id="passportSeries" 
                                  value={loanFormData.passportSeries}
                                  onChange={(e) => setLoanFormData({...loanFormData, passportSeries: e.target.value})}
                                  placeholder="1234"
                                  maxLength={4}
                                />
                              </div>
                              <div>
                                <Label htmlFor="passportNumber">Номер паспорта</Label>
                                <Input 
                                  id="passportNumber" 
                                  value={loanFormData.passportNumber}
                                  onChange={(e) => setLoanFormData({...loanFormData, passportNumber: e.target.value})}
                                  placeholder="567890"
                                  maxLength={6}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="amount">Сумма займа (руб.)</Label>
                                <Input 
                                  id="amount" 
                                  type="number"
                                  value={loanFormData.amount}
                                  onChange={(e) => setLoanFormData({...loanFormData, amount: e.target.value})}
                                  placeholder="50000"
                                />
                              </div>
                              <div>
                                <Label htmlFor="term">Срок займа (дней)</Label>
                                <Input 
                                  id="term" 
                                  type="number"
                                  value={loanFormData.term}
                                  onChange={(e) => setLoanFormData({...loanFormData, term: e.target.value})}
                                  placeholder="30"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="loanPhone">Телефон</Label>
                                <Input 
                                  id="loanPhone" 
                                  type="tel"
                                  value={loanFormData.phone}
                                  onChange={(e) => setLoanFormData({...loanFormData, phone: e.target.value})}
                                  placeholder="+7 (999) 123-45-67"
                                />
                              </div>
                              <div>
                                <Label htmlFor="loanEmail">Email</Label>
                                <Input 
                                  id="loanEmail" 
                                  type="email"
                                  value={loanFormData.email}
                                  onChange={(e) => setLoanFormData({...loanFormData, email: e.target.value})}
                                  placeholder="client@example.com"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label htmlFor="contactFullName">ФИО клиента</Label>
                              <Input 
                                id="contactFullName" 
                                value={contactFormData.fullName}
                                onChange={(e) => setContactFormData({...contactFormData, fullName: e.target.value})}
                                placeholder="Иванов Иван Иванович"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactPhone">Телефон</Label>
                              <Input 
                                id="contactPhone" 
                                type="tel"
                                value={contactFormData.phone}
                                onChange={(e) => setContactFormData({...contactFormData, phone: e.target.value})}
                                placeholder="+7 (999) 123-45-67"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactEmail">Email</Label>
                              <Input 
                                id="contactEmail" 
                                type="email"
                                value={contactFormData.email}
                                onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})}
                                placeholder="client@example.com"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={() => handleGenerateDocument(doc.type)} className="w-full bg-green-600 hover:bg-green-700">
                            <Icon name="FileDown" size={18} className="mr-2" />
                            Сформировать документ
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      onClick={() => handleCopyLink(doc.url, doc.id)}
                      variant="outline"
                      className="gap-2 border-2 hover:bg-gray-50"
                    >
                      <Icon 
                        name={copiedId === doc.id ? "Check" : "Copy"} 
                        size={18} 
                        className={copiedId === doc.id ? "text-green-600" : ""}
                      />
                      {copiedId === doc.id ? "Скопировано" : "Копировать ссылку"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="p-6 bg-white border-2 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Icon name="Image" size={24} className="text-primary" />
              Персонализация документов
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="logo" className="text-sm font-medium mb-2 block">
                  Загрузить логотип
                </Label>
                <div className="space-y-3">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                  />
                  {logo && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
                      <Icon name="CheckCircle" size={20} className="text-green-600" />
                      <span className="text-sm text-green-700">Логотип загружен</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setLogo(null)}
                        className="ml-auto"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="signature" className="text-sm font-medium mb-2 block">
                  Загрузить электронную подпись
                </Label>
                <div className="space-y-3">
                  <Input
                    id="signature"
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="cursor-pointer"
                  />
                  {signature && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
                      <Icon name="CheckCircle" size={20} className="text-green-600" />
                      <span className="text-sm text-green-700">Подпись загружена</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSignature(null)}
                        className="ml-auto"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-2">
                <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Загруженные изображения будут автоматически добавлены в документы при просмотре или скачивании
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border-2">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="User" size={20} className="text-primary" />
                  Реквизиты самозанятого
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">ФИО</span>
                    <span className="font-medium text-gray-800">Малик Степан Владимирович</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">ИНН</span>
                    <span className="font-medium text-gray-800">503303222876</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="MapPin" size={20} className="text-primary" />
                  Контактная информация
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Адрес</span>
                    <span className="font-medium text-gray-800">г. Москва, улица маршала Жукова, дом 53, офис 183</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Телефон</span>
                    <a href="tel:+74992733829" className="font-medium text-primary hover:underline">+7 (499) 273-38-29</a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="mt-6 text-center">
            <div className="bg-white rounded-lg shadow-md p-6 inline-block">
              <div className="flex items-center gap-3 text-gray-600">
                <Icon name="Lock" size={24} className="text-primary" />
                <p className="text-sm">
                  Все документы соответствуют действующему законодательству РФ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;