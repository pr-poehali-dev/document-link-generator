import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const CompanyInfo = () => {
  return (
    <>
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
    </>
  );
};

export default CompanyInfo;
