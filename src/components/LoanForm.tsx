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
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-base font-medium text-gray-900">
            ФИО полностью
          </Label>
          <Input 
            id="fullName" 
            value={formData.fullName}
            onChange={(e) => onChange({...formData, fullName: e.target.value})}
            placeholder="Иванов Иван Иванович"
            className="mt-2 h-14 text-base"
          />
        </div>

        <div>
          <Label htmlFor="birthDate" className="text-base font-medium text-gray-900">
            Дата рождения
          </Label>
          <Input 
            id="birthDate" 
            type="date"
            value={formData.birthDate}
            onChange={(e) => onChange({...formData, birthDate: e.target.value})}
            className="mt-2 h-14 text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="passportSeries" className="text-base font-medium text-gray-900">
              Паспорт серия
            </Label>
            <Input 
              id="passportSeries" 
              value={formData.passportSeries}
              onChange={(e) => onChange({...formData, passportSeries: e.target.value})}
              placeholder="1234"
              maxLength={4}
              inputMode="numeric"
              className="mt-2 h-14 text-base text-center"
            />
          </div>
          <div>
            <Label htmlFor="passportNumber" className="text-base font-medium text-gray-900">
              Паспорт номер
            </Label>
            <Input 
              id="passportNumber" 
              value={formData.passportNumber}
              onChange={(e) => onChange({...formData, passportNumber: e.target.value})}
              placeholder="567890"
              maxLength={6}
              inputMode="numeric"
              className="mt-2 h-14 text-base text-center"
            />
          </div>
        </div>
      </div>

        <div className="h-px bg-gray-200 my-2"></div>

        <div>
          <Label htmlFor="amount" className="text-base font-medium text-gray-900">
            Сумма займа
          </Label>
          <div className="relative mt-2">
            <Input 
              id="amount" 
              type="number"
              value={formData.amount}
              onChange={(e) => onChange({...formData, amount: e.target.value})}
              placeholder="50000"
              inputMode="decimal"
              className="h-14 text-xl font-semibold pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium">₽</span>
          </div>
        </div>

        <div>
          <Label htmlFor="term" className="text-base font-medium text-gray-900">
            Срок займа (дней)
          </Label>
          <div className="relative mt-2">
            <Input 
              id="term" 
              type="number"
              value={formData.term}
              onChange={(e) => onChange({...formData, term: e.target.value})}
              placeholder="30"
              inputMode="numeric"
              className="h-14 text-xl font-semibold"
            />
          </div>
        </div>

        {calculation && (
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Ставка:</span>
                <span className="font-semibold">1% в день</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Проценты:</span>
                <span className="font-semibold">
                  {calculation.interest.toLocaleString('ru-RU', {maximumFractionDigits: 2})} ₽
                </span>
              </div>
              <div className="h-px bg-green-300"></div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-semibold text-gray-800">К возврату:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculation.total.toLocaleString('ru-RU', {maximumFractionDigits: 2})} ₽
                </span>
              </div>
            </div>
          </Card>
        )}

        <div className="h-px bg-gray-200 my-2"></div>

        <div>
          <Label htmlFor="loanPhone" className="text-base font-medium text-gray-900">
            Телефон
          </Label>
          <Input 
            id="loanPhone" 
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange({...formData, phone: e.target.value})}
            placeholder="+7 (999) 123-45-67"
            inputMode="tel"
            className="mt-2 h-14 text-base"
          />
        </div>

        <div>
          <Label htmlFor="loanEmail" className="text-base font-medium text-gray-900">
            Email
          </Label>
          <Input 
            id="loanEmail" 
            type="email"
            value={formData.email}
            onChange={(e) => onChange({...formData, email: e.target.value})}
            placeholder="client@example.com"
            inputMode="email"
            className="mt-2 h-14 text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default LoanForm;