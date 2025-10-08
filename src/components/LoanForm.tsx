import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

interface LoanFormProps {
  formData: {
    fullName: string;
    birthDate: string;
    passportSeries: string;
    passportNumber: string;
    amount: string;
    term: string;
    phone: string;
    email: string;
  };
  onChange: (data: any) => void;
}

const LoanForm = ({ formData, onChange }: LoanFormProps) => {
  const calculateTotal = () => {
    if (!formData.amount || !formData.term) return null;
    const amount = parseFloat(formData.amount);
    const term = parseFloat(formData.term);
    const interest = amount * term * 0.01;
    const total = amount + interest;
    return { interest, total };
  };

  const calculation = calculateTotal();

  return (
    <div className="space-y-6">
      <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Icon name="Info" size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">Заполните данные для договора займа</h4>
            <p className="text-sm text-gray-600">Все поля обязательны для формирования документа</p>
          </div>
        </div>
      </Card>

      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary/10 p-1.5 rounded">
              <Icon name="User" size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800">Личные данные</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                <Icon name="User" size={14} className="text-gray-500" />
                ФИО полностью
              </Label>
              <Input 
                id="fullName" 
                value={formData.fullName}
                onChange={(e) => onChange({...formData, fullName: e.target.value})}
                placeholder="Иванов Иван Иванович"
                className="mt-1.5 h-11"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="birthDate" className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Calendar" size={14} className="text-gray-500" />
                  Дата рождения
                </Label>
                <Input 
                  id="birthDate" 
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => onChange({...formData, birthDate: e.target.value})}
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="passportSeries" className="text-sm font-medium flex items-center gap-2">
                  <Icon name="CreditCard" size={14} className="text-gray-500" />
                  Серия
                </Label>
                <Input 
                  id="passportSeries" 
                  value={formData.passportSeries}
                  onChange={(e) => onChange({...formData, passportSeries: e.target.value})}
                  placeholder="1234"
                  maxLength={4}
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="passportNumber" className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Hash" size={14} className="text-gray-500" />
                  Номер
                </Label>
                <Input 
                  id="passportNumber" 
                  value={formData.passportNumber}
                  onChange={(e) => onChange({...formData, passportNumber: e.target.value})}
                  placeholder="567890"
                  maxLength={6}
                  className="mt-1.5 h-11"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-100 p-1.5 rounded">
              <Icon name="DollarSign" size={18} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Условия займа</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
                <Icon name="Wallet" size={14} className="text-gray-500" />
                Сумма займа
              </Label>
              <div className="relative mt-1.5">
                <Input 
                  id="amount" 
                  type="number"
                  value={formData.amount}
                  onChange={(e) => onChange({...formData, amount: e.target.value})}
                  placeholder="50000"
                  className="h-12 text-lg font-semibold pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₽</span>
              </div>
            </div>
            <div>
              <Label htmlFor="term" className="text-sm font-medium flex items-center gap-2">
                <Icon name="Clock" size={14} className="text-gray-500" />
                Срок займа
              </Label>
              <div className="relative mt-1.5">
                <Input 
                  id="term" 
                  type="number"
                  value={formData.term}
                  onChange={(e) => onChange({...formData, term: e.target.value})}
                  placeholder="30"
                  className="h-12 text-lg font-semibold pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">дней</span>
              </div>
            </div>
          </div>
        </div>

        {calculation && (
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Calculator" size={20} className="text-green-600" />
              <h4 className="font-semibold text-gray-800">Расчёт платежа</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Процентная ставка:</span>
                <span className="font-semibold text-gray-800">1% в день</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Проценты за {formData.term} дней:</span>
                <span className="font-semibold text-gray-800">
                  {calculation.interest.toLocaleString('ru-RU', {maximumFractionDigits: 2})} ₽
                </span>
              </div>
              <div className="h-px bg-green-300 my-2"></div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-300">
                <span className="font-semibold text-gray-700">Итого к возврату:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculation.total.toLocaleString('ru-RU', {maximumFractionDigits: 2})} ₽
                </span>
              </div>
            </div>
          </Card>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-100 p-1.5 rounded">
              <Icon name="Phone" size={18} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Контактные данные</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanPhone" className="text-sm font-medium flex items-center gap-2">
                <Icon name="Phone" size={14} className="text-gray-500" />
                Телефон
              </Label>
              <Input 
                id="loanPhone" 
                type="tel"
                value={formData.phone}
                onChange={(e) => onChange({...formData, phone: e.target.value})}
                placeholder="+7 (999) 123-45-67"
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="loanEmail" className="text-sm font-medium flex items-center gap-2">
                <Icon name="Mail" size={14} className="text-gray-500" />
                Email
              </Label>
              <Input 
                id="loanEmail" 
                type="email"
                value={formData.email}
                onChange={(e) => onChange({...formData, email: e.target.value})}
                placeholder="client@example.com"
                className="mt-1.5 h-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanForm;
