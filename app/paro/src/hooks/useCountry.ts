import { useAtom } from 'jotai';
import { countryState } from '@/store/app.ts';
import { Country } from '@/types/enums.ts';

function useCountry() {
    const [state, setState] = useAtom(countryState);
    const setCountry = (country: Country) => {
        setState(country);
    };

    return { country: state, setCountry };
}
export default useCountry;
