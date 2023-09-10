import { FC, useState } from 'react';
import InputMask from 'react-input-mask';

type TEmail = {
    email: string;
    number: number;
};

const SearchForm: FC = () => {
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [record, setRecord] = useState<TEmail|null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();        

        setLoading(true);
        setRecord(null);
        
        fetch('http://localhost:3091/api/v1/email/search', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                email: email,
                number: number.replace(/-/g, '') // remove masked special chars
            })
        }).then(async (res) => {
            const json = await res.json();

            setLoading(false);

            if (res.ok) {
                setErrors([]);
                setRecord(json.data);
            } else {
                const msg = [];
                
                if (Array.isArray(json.errors)) {
                    json.errors.forEach((item: any) => {
                        msg.push(item.msg);
                    });
                } else {
                    msg.push(json.errors);
                }
                

                setErrors(msg);
                setRecord(null);
            }            
        });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(e.target.value);
    };

    return (
        <div className="search-form">
            {record && (
                <div>Record found: {record.email}</div>
            )}
            {errors && (
                <ul>
                    {errors.map((err, idx) => {
                        return <li key={idx}>{err}</li>
                    })}
                </ul>
            )}
            <form onSubmit={handleSubmit}>
                <div className="search-form field">
                    <label>E-mail:</label>
                    <input type="email" value={email} onChange={handleEmailChange}></input>
                    
                </div>
                <div className="search-form field">
                    <label>Number:</label>                    
                    <InputMask mask="99-99-99" maskChar="_" name="number" onChange={handleNumberChange}/>
                </div>
                <div className="search-form button">
                    <button type="submit" disabled={loading}>Find item</button>
                    {loading && 'loading ...'}
                </div>
            </form>
        </div>
    );
};

export default SearchForm;