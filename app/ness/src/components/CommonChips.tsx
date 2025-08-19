function CommonChips({ value }: { value: string }) {
    return (
        <p className={`text-m12 text-grey-90 bg-grey-5 border-grey-20 w-fit rounded-[24px] border px-[8px] py-[4px]`}>
            {value}
        </p>
    );
}
export default CommonChips;
