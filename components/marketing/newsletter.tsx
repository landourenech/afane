"use client"
import { Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import {Button} from "@/components/ui/button"

export default function Newsletter() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Logique d'envoi d'email ici
        console.log("Email inscrit :", email);
    };

    return (
        <section className="bg-cover bg-no-repeat bg-center bg-[url(/newsletter.png)] p-10 md:p-12 text-[var(--text-tertiary)] flex flex-col items-center text-center justify-center gap-6 md:gap-8  text-[var(--color-primary)] h-[40vh] md:h-[60vh] "> 
            <p className="text-[var(--color-quinary)] ">
                S'inscrire à la newsletter
            </p>
            <h2 className="text-2xl md:text-4xl font-bold max-w-2xl leading-tight">
                Rejoignez la révolution agricole dès aujourd'hui !
            </h2>

            <form onSubmit={handleSubmit} className="flex  sm:flex-row w-[50%] ">
             <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre adresse e-mail"
                    required
                    className="px-4 py-3 rounded-l-md rounded-r-none text-text-primary backdrop-blur-sm focus:outline-none text-[var(--color-secondary)] placeholder:text-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)] flex-1"
                    aria-label="Adresse e-mail"
                />
                <Button 
                    type="submit" 
                    aria-label="S'inscrire"
                    className="btn btn-primary rounded-r-md rounded-l-none p-3 flex items-center justify-center shrink-0"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </form>
        </section>
    );
}