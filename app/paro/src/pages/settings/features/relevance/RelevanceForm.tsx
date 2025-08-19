import { Button, SelectOption, TextInput } from '@plitvice/ui';
import { Language } from '@/types/enums.ts';
import { useTranslation } from 'react-i18next';
import { RelevanceLocalized } from '@/api/model/relevance.ts';
import { Dialog } from '@plitvice/ui/components/expandfield/Dialog.tsx';
import useRelevanceForm from '@/pages/settings/features/relevance/RelevanceForm.hooks.ts';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (relevanceList: RelevanceLocalized) => void;
};

function RelevanceForm({ isOpen, onClose, onAdd }: Props) {
    const { t } = useTranslation();
    const { changeFn, insertFn } = useRelevanceForm();

    const handleInsert = () => {
        const result = insertFn();
        if (result) {
            onAdd(result);
            onClose();
        } else {
            alert(t('relevance.dialog.requiredCode'));
        }
    };

    return (
        <Dialog width={640} height={0} open={isOpen} onClose={onClose} className={`p-[24px]`}>
            <div className={`flex h-full flex-col justify-between`}>
                <div className={`border-grey-20 border-b`}>
                    <p className={`text-b20`}>Add new relevance</p>
                    <div className={`flex items-start gap-[12px] pb-[16px] pt-[24px]`}>
                        <div className={`flex flex-1 flex-col items-start`}>
                            <p className={`text-r16 text-grey-70 leading-[24px]`}>{Language[0].label}</p>
                            <p className={`text-r14 text-red-500`}>{t('common.required')}</p>
                        </div>
                        <TextInput
                            width={420}
                            placeholder={t('relevance.dialog.placeholder')}
                            onChange={(value: string) => changeFn(Language[0].value, value)}
                        />
                    </div>
                </div>
                <div className={`flex flex-1 flex-col gap-[16px] py-[16px]`}>
                    {Language.slice(1).map((option: SelectOption) => {
                        return (
                            <div key={`relevance-input-${option.value}`} className={`flex items-start gap-[48px]`}>
                                <div className={`flex flex-1 flex-col items-start`}>
                                    <p className={`text-r16 text-grey-70 leading-[24px]`}>{option.label}</p>
                                    <p className={`text-r14 text-grey-40`}>{t('common.optional')}</p>
                                </div>
                                <TextInput
                                    width={420}
                                    placeholder={t('relevance.dialog.placeholder')}
                                    onChange={(value: string) => changeFn(option.value, value)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className={`border-grey-20 flex justify-end gap-[12px] border-t pt-[24px]`}>
                    <Button fill={false} onClick={onClose}>
                        {t('button.cancel')}
                    </Button>
                    <Button variant={'normal'} onClick={handleInsert}>
                        {t('button.add')}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
export default RelevanceForm;
