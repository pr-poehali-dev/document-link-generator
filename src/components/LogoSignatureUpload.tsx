import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoSignatureUploadProps {
  logo: string | null;
  signature: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  onSignatureRemove: () => void;
}

const LogoSignatureUpload = ({
  logo,
  signature,
  onLogoUpload,
  onSignatureUpload,
  onLogoRemove,
  onSignatureRemove,
}: LogoSignatureUploadProps) => {
  return (
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
              onChange={onLogoUpload}
              className="cursor-pointer"
            />
            {logo && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
                <span className="text-sm text-green-700">Логотип загружен</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onLogoRemove}
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
              onChange={onSignatureUpload}
              className="cursor-pointer"
            />
            {signature && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
                <span className="text-sm text-green-700">Подпись загружена</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onSignatureRemove}
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
  );
};

export default LogoSignatureUpload;
