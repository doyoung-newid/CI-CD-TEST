import { useTranslation } from 'react-i18next';
import '@plitvice/ui/styles/global.css';
import { useState } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
    SingleDatePickerBox,
    DateRange,
    DateRangePickerBox,
    Button,
    Drawer,
    Tooltip,
    useToast,
    InfoIcon,
    Checkbox,
    CopyTooltip,
    TabMenu,
    ActionChip,
} from '@plitvice/ui';
import { RadioButton } from '@plitvice/ui/components/button/RadioButton';

function App() {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);

    const { showToast } = useToast();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <div className="scrollbar relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center gap-3 overflow-auto">
            <h1 className="box-border w-full whitespace-nowrap break-words bg-gradient-to-r from-[rgb(0,111,185)] via-[rgb(111,44,135)] to-[rgb(221,37,20)] bg-clip-text text-center text-[10rem] leading-[1.2] text-transparent">
                {t('common.appName')}
            </h1>
            <Button onClick={toggleDrawer(true)} variant={'normal'}>
                Open
            </Button>
            <Button onClick={() => showToast('Show Toast', 'info')}>Show Toast</Button>
            <Drawer open={open} onClose={toggleDrawer(false)} width={400} className={'flex justify-center'}>
                <div>Hello Drawer</div>
            </Drawer>
            <ActionChip size={'extraSmall'} onClick={() => {}}>
                Chip
            </ActionChip>
            <ActionChip size={'medium'} icon={<InfoIcon />} selected={true} onClick={() => {}}>
                Chip
            </ActionChip>
            <TooltipGroup />
            <CheckboxGroup />
            <RadioButton>Label</RadioButton>
            <TabMenu
                tabList={[
                    { value: 'item01', label: 'Item01' },
                    { value: 'item02', label: 'Item02' },
                    { value: 'item03', label: 'Item03' },
                ]}
            />
            <div className={`h-[400px]`} />
            <SelectBox optionList={defaultComboBoxOptions} border={true} width={200} label={'test'} size={'medium'} />
            <DatePickerGroup />
        </div>
    );
}

export default App;

const TooltipGroup = () => {
    const displayText = 'Proc Time';
    const text =
        '프리셋은 presetId 기준으로 렌더링되며, FFmpeg 명령어 내 {INPUT}, {OUTPUT} 토큰은 실행 시 경로로 치환되고, 유저 그룹 및 회사 기준으로 필터링 가능하며, 삭제 전 종속성 확인이 필요하고, 날짜는 UTC 기준 ISO 8601 포맷을 권장합니다.';
    const { showToast } = useToast();

    return (
        <>
            <CopyTooltip text={text} />
            <CopyTooltip
                text={'프리셋은 presetId 기준으로 렌더링'}
                className={`line-clamp-1 w-[400px] bg-orange-100`}
                onCopySuccess={() => showToast('텍스트가 복사되었습니다.', 'info')}
            />
            <CopyTooltip
                maxWidth={560}
                text={text}
                className={`line-clamp-1 w-[400px] bg-orange-100`}
                onCopySuccess={() => showToast('텍스트가 복사되었습니다.', 'info')}
            />
            <Tooltip text={text} maxWidth={280}>
                <p>{displayText}</p>
            </Tooltip>
            <Tooltip text={text} maxWidth={280}>
                <InfoIcon className={'text-red-600'} />
            </Tooltip>
        </>
    );
};

export const DatePickerGroup = () => {
    return (
        <div className="mb-3 flex flex-col gap-3">
            <SingleDatePicker />
            <RangeTimePicker />
        </div>
    );
};

const SingleDatePicker = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    return (
        <div className="flex flex-col gap-2">
            <p>일 선택</p>
            <SingleDatePickerBox
                placeholder="날짜를 선택하세요"
                width={200}
                showTime={true}
                buttonText={{ delete: '삭제', today: '오늘' }}
                validationMessages={{ invalidTime: '유효하지 않은 시간', invalidDate: '유효하지 않은 날짜' }}
                locale={ko}
                value={selectedDate}
                onChange={setSelectedDate}
            />
        </div>
    );
};

const RangeTimePicker = () => {
    const today = startOfDay(new Date());
    // const today = new Date('2025-07-08');
    const before = startOfDay(addDays(today, -7));

    const INITIAL_DATE_RANGE: DateRange = {
        from: before,
        to: today,
    };
    const [dateRange, setDateRange] = useState<DateRange>(INITIAL_DATE_RANGE);

    return (
        <div className="flex flex-col gap-2">
            <p>시작/종료일 및 시간 선택</p>
            <DateRangePickerBox
                disabledCondition={(date: Date) => date > today}
                width={350}
                showTime={true}
                value={dateRange}
                maxDays={8}
                onChange={(value: DateRange | undefined) => {
                    if (value) {
                        setDateRange(value);
                    }
                }}
            />
        </div>
    );
};

const CheckboxGroup = () => {
    const [items, setItems] = useState([
        { id: 1, name: 'Item 1', checked: false },
        { id: 2, name: 'Item 2', checked: true },
        { id: 3, name: 'Item 3', checked: false },
    ]);

    const checkedCount = items.filter((item) => item.checked).length;
    const isAllChecked = checkedCount === items.length;
    const isIndeterminate = checkedCount > 0 && checkedCount < items.length;

    const handleSelectAll = (checked: boolean) => {
        setItems((prev) => prev.map((item) => ({ ...item, checked })));
    };

    const handleItemCheck = (id: number, checked: boolean) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked } : item)));
    };

    return (
        <div className="flex flex-col rounded bg-gray-50 p-2">
            <Checkbox checked={isAllChecked} indeterminate={isIndeterminate} onChange={handleSelectAll}>
                Select All
            </Checkbox>
            <div className="flex flex-col pl-2">
                {items.map((item) => (
                    <Checkbox
                        key={item.id}
                        id={item.id.toString()}
                        checked={item.checked}
                        onChange={(checked: boolean) => handleItemCheck(item.id, checked)}
                    >
                        {item.name}
                    </Checkbox>
                ))}
            </div>
        </div>
    );
};
