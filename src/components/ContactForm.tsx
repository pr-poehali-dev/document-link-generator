import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

interface ContactFormProps {
  formData: {
    fullName: string;
    phone: string;
    email: string;
  };
  onChange: (data: any) => void;
}

const ContactForm = ({ formData, onChange }: ContactFormProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Icon name="UserCheck" size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">Заполните контактные данные</h4>
            <p className="text-sm text-gray-600">Для формирования документа требуется минимальная информация</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div>
          <Label htmlFor="contactFullName" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Icon name="User" size={16} className="text-gray-500" />
            ФИО полностью
          </Label>
          <Input 
            id="contactFullName" 
            value={formData.fullName}
            onChange={(e) => onChange({...formData, fullName: e.target.value})}
            placeholder="Иванов Иван Иванович"
            className="h-12 text-base"
          />
        </div>
        
        <div>
          <Label htmlFor="contactPhone" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Icon name="Phone" size={16} className="text-gray-500" />
            Телефон
          </Label>
          <Input 
            id="contactPhone" 
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange({...formData, phone: e.target.value})}
            placeholder="+7 (999) 123-45-67"
            className="h-12 text-base"
          />
        </div>
        
        <div>
          <Label htmlFor="contactEmail" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Icon name="Mail" size={16} className="text-gray-500" />
            Email
          </Label>
          <Input 
            id="contactEmail" 
            type="email"
            value={formData.email}
            onChange={(e) => onChange({...formData, email: e.target.value})}
            placeholder="client@example.com"
            className="h-12 text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
