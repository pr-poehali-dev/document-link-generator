import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Template {
  id: string;
  name: string;
  type: 'loan' | 'contact';
  data: any;
  createdAt: string;
}

interface TemplateManagerProps {
  onLoadTemplate: (template: Template) => void;
  currentTemplateData?: {data: any, type: 'loan' | 'contact'} | null;
}

const TemplateManager = ({ onLoadTemplate, currentTemplateData }: TemplateManagerProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const saved = localStorage.getItem('documentTemplates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название шаблона",
        variant: "destructive"
      });
      return;
    }

    if (!currentTemplateData) {
      toast({
        title: "Ошибка",
        description: "Сначала заполните форму и нажмите 'Сохранить как шаблон'",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateName,
      type: currentTemplateData.type,
      data: currentTemplateData.data,
      createdAt: new Date().toISOString()
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('documentTemplates', JSON.stringify(updatedTemplates));

    toast({
      title: "Шаблон сохранён",
      description: `Шаблон "${templateName}" успешно сохранён`
    });

    setOpenSaveDialog(false);
    setTemplateName('');
  };

  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem('documentTemplates', JSON.stringify(updatedTemplates));

    toast({
      title: "Шаблон удалён",
      description: "Шаблон успешно удалён"
    });
  };

  const handleLoadTemplate = (template: Template) => {
    onLoadTemplate(template);
    toast({
      title: "Шаблон загружен",
      description: `Данные из шаблона "${template.name}" загружены в форму`
    });
  };

  const openSaveTemplateDialog = (data: any, type: 'loan' | 'contact') => {
    setCurrentTemplateData(data);
    setCurrentTemplateType(type);
    setOpenSaveDialog(true);
  };

  return (
    <Card className="p-6 bg-white border-2 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Icon name="BookmarkPlus" size={24} className="text-primary" />
          Шаблоны договоров
        </h3>
        <Dialog open={openSaveDialog} onOpenChange={setOpenSaveDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Создать шаблон
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Сохранить как шаблон</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="templateName">Название шаблона</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Например: Стандартный займ 30 дней"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={saveTemplate} className="w-full">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить шаблон
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Icon name="FileQuestion" size={48} className="mx-auto mb-3 opacity-50" />
          <p>Нет сохранённых шаблонов</p>
          <p className="text-sm mt-2">Создайте шаблон для быстрого заполнения документов</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/40 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon
                    name={template.type === 'loan' ? 'FileText' : 'User'}
                    size={18}
                    className="text-primary"
                  />
                  <h4 className="font-medium text-gray-800">{template.name}</h4>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {template.type === 'loan' ? 'Договор займа' : 'Контактные данные'}
                  {' · '}
                  {new Date(template.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleLoadTemplate(template)}
                  className="gap-1"
                >
                  <Icon name="Download" size={16} />
                  Загрузить
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex gap-2">
          <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Шаблоны сохраняются в вашем браузере и доступны только на этом устройстве
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TemplateManager;