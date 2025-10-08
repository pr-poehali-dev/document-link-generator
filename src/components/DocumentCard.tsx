import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                    {loanFormData.amount && loanFormData.term && (
                      <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Процентная ставка:</span>
                            <p className="font-semibold text-gray-800">1% в день</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Проценты за период:</span>
                            <p className="font-semibold text-gray-800">
                              {(parseFloat(loanFormData.amount) * parseFloat(loanFormData.term) * 0.01).toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-blue-300">
                            <span className="text-gray-600">Сумма к возврату:</span>
                            <p className="text-xl font-bold text-primary">
                              {(parseFloat(loanFormData.amount) * (1 + parseFloat(loanFormData.term) * 0.01)).toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                <DialogFooter className="flex-col gap-2">
                  <Button 
                    onClick={() => onSaveTemplate(
                      doc.type === 'loan' ? loanFormData : contactFormData,
                      doc.type === 'loan' ? 'loan' : 'contact'
                    )} 
                    variant="outline"
                    className="w-full"
                  >
                    <Icon name="BookmarkPlus" size={18} className="mr-2" />
                    Сохранить как шаблон
                  </Button>
                  <Button onClick={() => onGenerateDocument(doc.type)} className="w-full bg-green-600 hover:bg-green-700">
                    <Icon name="FileDown" size={18} className="mr-2" />
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