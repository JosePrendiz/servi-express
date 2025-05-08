'use client';
import React from 'react';

export default function TermsAndPrivacy() {
    return (
        <div className="terms-container mx-auto max-w-4xl p-6">
            <h1 className="title">TÉRMINOS Y POLÍTICA DE PRIVACIDAD</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Aceptación de los Términos</h2>
                <p className="text-gray-700 leading-relaxed">
                    Al acceder y utilizar la plataforma ServiExpress (en adelante “la Plataforma”), aceptas de forma expresa
                    los presentes Términos y Condiciones de Uso, así como nuestra Política de Privacidad. Si no estás de acuerdo
                    con estos términos, no deberías utilizar la Plataforma.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Uso de la Plataforma</h2>
                <h3 className="text-xl font-medium mb-2 text-gray-700">2.1 Usuarios y responsabilidades</h3>
                <p className="text-gray-700 leading-relaxed">
                    ServiExpress actúa como un intermediario digital entre personas que ofrecen servicios (handymen) y personas que los solicitan
                    (clientes). La Plataforma no es parte de los contratos de servicio que se generen ni garantiza el resultado de los mismos.
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                    <li>Proporcionar información veraz en su perfil.</li>
                    <li>Utilizar la plataforma de forma honesta y sin ánimo de fraude o suplantación.</li>
                    <li>Respetar a otros usuarios, incluyendo normas de buena conducta y no discriminación.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                    Nos reservamos el derecho de suspender cuentas por incumplimiento de estas reglas.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-2 text-gray-700">2.2 Contrataciones</h3>
                <p className="text-gray-700 leading-relaxed">
                    Los acuerdos entre cliente y handyman (incluyendo precio, condiciones y cumplimiento del servicio) son responsabilidad exclusiva
                    de ambas partes. ServiExpress no garantiza, interfiere ni media en disputas salvo para efectos administrativos
                    (como bloqueos o investigaciones internas).
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Política de Privacidad</h2>
                <h3 className="text-xl font-medium mb-2 text-gray-700">3.1 Datos que recopilamos</h3>
                <p className="text-gray-700 leading-relaxed">
                    Al registrarte y usar ServiExpress, recopilamos información personal como:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                    <li>Nombre y apellido</li>
                    <li>Foto de perfil (vía cuenta Google)</li>
                    <li>Correo electrónico</li>
                    <li>Número de teléfono</li>
                    <li>Dirección (municipio, barrio)</li>
                    <li>Habilidades o servicios prestados</li>
                    <li>Calificaciones recibidas o emitidas</li>
                    <li>Historial de mensajes y solicitudes dentro de la app</li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-2 text-gray-700">3.2 Finalidad del tratamiento</h3>
                <p className="text-gray-700 leading-relaxed">
                    Tus datos se utilizan para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                    <li>Crear y mantener tu cuenta activa</li>
                    <li>Facilitar coincidencias entre cliente y handyman</li>
                    <li>Mejorar la seguridad y experiencia en la plataforma</li>
                    <li>Cumplir requerimientos legales si fuera necesario</li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-2 text-gray-700">3.3 Conservación de datos</h3>
                <p className="text-gray-700 leading-relaxed">
                    Conservamos los datos durante el tiempo que tu cuenta esté activa y hasta 12 meses luego de su eliminación, salvo solicitud
                    expresa de eliminación inmediata.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-2 text-gray-700">3.4 Eliminación y derechos ARCO</h3>
                <p className="text-gray-700 leading-relaxed">
                    Puedes solicitar en cualquier momento:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                    <li>El acceso a tus datos personales</li>
                    <li>La corrección o actualización de los mismos</li>
                    <li>La eliminación total de tu cuenta y tus registros</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                    Escríbenos a <a href="mailto:aserviexpressrivas@gmail.com" className="text-blue-600 underline">serviexpressrivas@gmail.com</a> para ejercer estos derechos.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Seguridad</h2>
                <p className="text-gray-700 leading-relaxed">
                    Implementamos medidas técnicas y organizativas para proteger tu información personal contra accesos no autorizados, pérdida o destrucción.
                    Sin embargo, no somos responsables por vulnerabilidades que ocurran por terceros ajenos a la plataforma (como hackeos a Google, errores
                    del dispositivo del usuario, etc.).
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Cambios en los Términos</h2>
                <p className="text-gray-700 leading-relaxed">
                    ServiExpress se reserva el derecho de actualizar estos términos en cualquier momento. Notificaremos a los usuarios con al menos
                    7 días de anticipación mediante la plataforma o correo electrónico.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Jurisdicción</h2>
                <p className="text-gray-700 leading-relaxed">
                    Cualquier controversia legal que surja en relación con la Plataforma será resuelta bajo las leyes de la República de Nicaragua,
                    sometiéndose a la jurisdicción de sus tribunales competentes.
                </p>
            </section>
        </div>
    );
}
