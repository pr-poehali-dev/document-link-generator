import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const documents = [
  {
    id: 1,
    title: "Договор займа",
    description: "Типовой договор займа с полным перечнем условий и обязательств сторон",
    url: "https://example.com/documents/loan-agreement.pdf",
    icon: "FileText"
  },
  {
    id: 2,
    title: "Согласие на обработку персональных данных",
    description: "Документ о согласии на сбор и обработку персональных данных в соответствии с законодательством",
    url: "https://example.com/documents/personal-data-consent.pdf",
    icon: "Shield"
  },
  {
    id: 3,
    title: "Возврат платежей",
    description: "Порядок и условия возврата денежных средств согласно действующему законодательству",
    url: "https://example.com/documents/refund-policy.pdf",
    icon: "ArrowLeftRight"
  }
];

const Index = () => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyLink = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на документ успешно скопирована в буфер обмена",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
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
                      onClick={() => handleDownload(doc.url)}
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                    >
                      <Icon name="Download" size={18} />
                      Скачать
                    </Button>
                    
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

        <div className="mt-12 text-center">
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
  );
};

export default Index;
