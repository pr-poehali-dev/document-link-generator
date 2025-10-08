import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import LoanForm from "./LoanForm";
import ContactForm from "./ContactForm";

interface DocumentCardProps {
  doc: {
    id: number;
    title: string;
    description: string;
    url: string;
    icon: string;
    type: string;
  };
  index: number;
  copiedId: number | null;
  openDialog: string | null;
  loanFormData: {
    fullName: string;
    birthDate: string;
    passportSeries: string;
    passportNumber: string;
    amount: string;
    term: string;
    phone: string;
    email: string;
  };
  contactFormData: {
    phone: string;
    email: string;
    fullName: string;
  };
  onView: (url: string) => void;
  onDownload: (url: string) => void;
  onCopyLink: (url: string, id: number) => void;
  onGenerateDocument: (docType: string) => void;
  onSaveTemplate: (data: any, type: 'loan' | 'contact') => void;
  setOpenDialog: (type: string | null) => void;
  setLoanFormData: (data: any) => void;
  setContactFormData: (data: any) => void;
}

const DocumentCard = ({
  doc,
  index,
  copiedId,
  openDialog,
  loanFormData,
  contactFormData,
  onView,
  onDownload,
  onCopyLink,
  onGenerateDocument,
  onSaveTemplate,
  setOpenDialog,
  setLoanFormData,
  setContactFormData,
}: DocumentCardProps) => {
  return (
    <Card 
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
              onClick={() => onView(doc.url)}
              className="bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <Icon name="Eye" size={18} />
              Просмотр
            </Button>
            
            <Button 
              onClick={() => onDownload(doc.url)}
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
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon name={doc.icon as any} size={24} className="text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{doc.title}</DialogTitle>
                      <p className="text-sm text-gray-500 mt-1">Заполните форму для формирования документа</p>
                    </div>
                  </div>
                </DialogHeader>
                <div className="py-4">
                  {doc.type === 'loan' ? (
                    <LoanForm formData={loanFormData} onChange={setLoanFormData} />
                  ) : (
                    <ContactForm formData={contactFormData} onChange={setContactFormData} />
                  )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => onSaveTemplate(
                      doc.type === 'loan' ? loanFormData : contactFormData,
                      doc.type === 'loan' ? 'loan' : 'contact'
                    )} 
                    variant="outline"
                    className="w-full sm:w-auto gap-2"
                  >
                    <Icon name="BookmarkPlus" size={18} />
                    Сохранить как шаблон
                  </Button>
                  <Button 
                    onClick={() => onGenerateDocument(doc.type)} 
                    className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 h-12 text-base font-semibold"
                  >
                    <Icon name="FileDown" size={20} />
                    Сформировать документ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={() => onCopyLink(doc.url, doc.id)}
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
  );
};

export default DocumentCard;