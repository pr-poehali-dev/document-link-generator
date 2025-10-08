import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DocumentCard from "@/components/DocumentCard";
import LogoSignatureUpload from "@/components/LogoSignatureUpload";
import CompanyInfo from "@/components/CompanyInfo";
import TemplateManager from "@/components/TemplateManager";

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

  const [templateToSave, setTemplateToSave] = useState<{data: any, type: 'loan' | 'contact'} | null>(null);

  const handleSaveTemplate = (data: any, type: 'loan' | 'contact') => {
    setTemplateToSave({ data, type });
    toast({
      title: "Данные готовы",
      description: "Теперь нажмите 'Создать шаблон' ниже для сохранения",
    });
  };

  const handleLoadTemplate = (template: any) => {
    if (template.type === 'loan') {
      setLoanFormData(template.data);
      setOpenDialog('loan');
    } else {
      setContactFormData(template.data);
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
            <DocumentCard
              key={doc.id}
              doc={doc}
              index={index}
              copiedId={copiedId}
              openDialog={openDialog}
              loanFormData={loanFormData}
              contactFormData={contactFormData}
              onView={handleView}
              onDownload={handleDownload}
              onCopyLink={handleCopyLink}
              onGenerateDocument={handleGenerateDocument}
              onSaveTemplate={handleSaveTemplate}
              setOpenDialog={setOpenDialog}
              setLoanFormData={setLoanFormData}
              setContactFormData={setContactFormData}
            />
          ))}
        </div>

        <div className="mt-12">
          <TemplateManager 
            onLoadTemplate={handleLoadTemplate}
            currentTemplateData={templateToSave}
          />
          
          <LogoSignatureUpload
            logo={logo}
            signature={signature}
            onLogoUpload={handleLogoUpload}
            onSignatureUpload={handleSignatureUpload}
            onLogoRemove={() => setLogo(null)}
            onSignatureRemove={() => setSignature(null)}
          />
          
          <CompanyInfo />
        </div>
      </div>
    </div>
  );
};

export default Index;