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
    TooltipBox,
    useToast,
    TextCopier,
} from '@plitvice/ui';

function App() {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const text =
        '프리셋은 presetId 기준으로 렌더링되며, FFmpeg 명령어 내 {INPUT}, {OUTPUT} 토큰은 실행 시 경로로 치환되고, 유저 그룹 및 회사 기준으로 필터링 가능하며, 삭제 전 종속성 확인이 필요하고, 날짜는 UTC 기준 ISO 8601 포맷을 권장합니다.';
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
            <TooltipBox text={text} className={`line-clamp-2 w-[200px]`} />
            <TextCopier value={text} className={`line-clamp-2 w-[200px]`} />
        </div>
    );
}

export default App;

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
                showTime={false}
                buttonText={{ delete: '삭제', today: '오늘' }}
                locale={ko}
                value={selectedDate}
                onChange={setSelectedDate}
            />
        </div>
    );
};

const RangeTimePicker = () => {
    const today = startOfDay(new Date());
    const nextWeek = startOfDay(addDays(today, 7));

    const INITIAL_DATE_RANGE: DateRange = {
        from: today,
        to: nextWeek,
    };
    const [dateRange, setDateRange] = useState<DateRange>(INITIAL_DATE_RANGE);

    return (
        <div className="flex flex-col gap-2">
            <p>시작/종료일 및 시간 선택</p>
            <DateRangePickerBox width={350} showTime={true} value={dateRange} onChange={setDateRange} />
        </div>
    );
};
