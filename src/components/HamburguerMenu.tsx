'use client';
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HamburguerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className=" absolute top-0 right-0 p-4">
            <button
                aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    width: 40,
                    height: 40,
                }}
            >
                <div style={{
                    width: 30,
                    height: 3,
                    background: "#333",
                    margin: "6px 0",
                    transition: "0.4s",
                    transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none"
                }} />
                <div style={{
                    width: 30,
                    height: 3,
                    background: "#333",
                    margin: "6px 0",
                    opacity: isOpen ? 0 : 1,
                    transition: "0.4s"
                }} />
                <div style={{
                    width: 30,
                    height: 3,
                    background: "#333",
                    margin: "6px 0",
                    transition: "0.4s",
                    transform: isOpen ? "rotate(-45deg) translate(7px, -7px)" : "none"
                }} />
            </button>
            {/* Menu suspenso */}
            {isOpen && (
                <nav style={{
                    position: "absolute",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    padding: 16,
                    left: -50,
                    zIndex: 100,
                }}>
                    <ul className="flex flex-col gap-2" onClick={() => setIsOpen(false)}>
                        <li>
                            <Link
                                className="flex items-center justify-center gap-2 hover:underline hover:underline-offset-4"
                                href="/"

                            >
                                <Image
                                    aria-hidden
                                    src="/window.svg"
                                    alt="File icon"
                                    width={16}
                                    height={16}
                                />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center justify-center gap-2 hover:underline hover:underline-offset-4"
                                href="/sobre"

                            >
                                <Image
                                    aria-hidden
                                    src="/file.svg"
                                    alt="File icon"
                                    width={16}
                                    height={16}
                                />
                                Sobre
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    )
}