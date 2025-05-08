import React from 'react';

export default function AboutUs() {
    return (
        <div className="about-us-container mx-auto max-w-4xl p-6">
            <h1 className="title">SOBRE NOSOTROS</h1>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">¿Quiénes somos?</h2>
                <p className="text-gray-700 leading-relaxed">
                    ServiExpress es una plataforma digital fundada en Nicaragua con el objetivo de conectar a personas que necesitan
                    servicios profesionales a domicilio con trabajadores autónomos (handymen). Nuestro sistema permite contratar
                    de forma rápida, segura y transparente a personas calificadas para realizar tareas como plomería, electricidad, carpintería,
                    limpieza, mantenimiento y más.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Nuestra misión</h2>
                <p className="text-gray-700 leading-relaxed">
                    Facilitar la contratación de servicios en el hogar mediante una plataforma intuitiva que reduzca la informalidad laboral,
                    fortalezca la confianza entre clientes y proveedores, y potencie el empleo digno en las comunidades urbanas y rurales del país.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Nuestra visión</h2>
                <p className="text-gray-700 leading-relaxed">
                    Convertirnos en la principal plataforma de intermediación de servicios en Nicaragua, ofreciendo tecnología accesible,
                    procesos claros y soporte al crecimiento profesional de los handymen registrados.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">¿Por qué ServiExpress?</h2>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                    <li>Simplificamos la búsqueda de trabajadores confiables.</li>
                    <li>Defendemos la formalización del empleo independiente.</li>
                    <li>Ofrecemos un sistema justo de calificación, negociación y soporte.</li>
                    <li>Creemos en una economía local más colaborativa, transparente y tecnológica.</li>
                </ul>
            </section>
            <section className="mt-10 text-center">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">
                    ¿Listo para comenzar?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                    Únete a nuestra comunidad y descubre lo fácil que es contratar u ofrecer servicios con ServiExpress.
                </p>
            </section>
        </div>
    );
}
