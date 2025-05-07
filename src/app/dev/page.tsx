'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";

const HappyBirthdayOscar = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    const handleCelebrate = () => {
        setShowConfetti(!showConfetti);
    };

    return (
        <div
            className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white overflow-hidden"
            style={{
                cursor: "url(https://cur.cursors-4u.net/food/foo-2/foo120.cur), auto",
            }}
        >
            {/* Dynamic background animation */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-400 opacity-40"
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "400% 400%" }}
            />

            <motion.h1
                className="text-6xl font-extrabold mb-8 text-center drop-shadow-xl"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                🎉✨ Feliz CUM-pleaños, Osrcar! ✨🎉
            </motion.h1>

            <motion.p
                className="text-xl mb-8 text-center italic opacity-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
            >
                &ldquo;Puta para los amigos, leyenda para... para nadie, pinshe puta que es.&rdquo;
            </motion.p>
            <motion.p
                className="text-xl mb-8 text-center italic opacity-90"
                style={{ justifyContent: "end" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
            >
                -Mr P.
            </motion.p>

            <motion.button
                onClick={handleCelebrate}
                className="px-8 py-4 text-xl font-semibold rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-black shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                style={{
                    cursor: "url(https://cur.cursors-4u.net/smilies/smi-1/smi18.ani), auto",
                }}
                whileHover={{ scale: 1.1 }}
            >
                <motion.span
                    className="absolute inset-0 rounded-full blur-lg opacity-50"
                    style={{ background: "radial-gradient(circle, white, transparent)" }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                Tocame suavecito bb
            </motion.button>

            {showConfetti && (
                <motion.div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Enhanced confetti animation */}
                    {[...Array(150)].map((_, index) => (
                        <motion.div
                            key={index}
                            className="absolute w-2 h-2 bg-white rounded-full"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, 100],
                                x: [0, Math.random() * 200 - 100],
                                opacity: [1, 0],
                            }}
                            transition={{
                                duration: Math.random() * 2 + 1,
                                repeat: Infinity,
                            }}
                        />
                    ))}

                    {/* Sparkle effect */}
                    {[...Array(50)].map((_, index) => (
                        <motion.div
                            key={`sparkle-${index}`}
                            className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0, 1],
                            }}
                            transition={{
                                duration: Math.random() * 1.5 + 0.5,
                                repeat: Infinity,
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default HappyBirthdayOscar;
