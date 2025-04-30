'use client';
import React, { useState } from 'react';
import { municipalities } from 'app/locations';
import { HandymanData } from 'app/interfaces';
import { serviceAPI } from 'app/axios';

export default function StartServiceRequest({
    handyman,
    role,
    onServiceResponse,
}: {
    handyman: HandymanData;
    role: string | undefined;
    onServiceResponse: (response: string) => void;
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        municipality: '',
        neighborhood: '',
        address: '',
        category: '',
    });

    const selectedMunicipality = municipalities.find(
        (item) => item.municipality === formData.municipality
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'municipality') {
            setFormData((prev) => ({ ...prev, neighborhood: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (role === 'handyman') {
            alert('No puedes solicitar un servicio como un trabajador. Por favor, inicia sesión como cliente.');
            return;
        }
        e.preventDefault();
        const payload = {
            title: formData.title,
            handymanEmail: handyman.email,
            description: formData.description,
            location: {
                municipality: formData.municipality,
                neighborhood: formData.neighborhood,
                address: formData.address,
            },
            categories: [formData.category],
        };

        try {
            const response = await serviceAPI.requestService(payload);
            onServiceResponse(response.requestId);
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al solicitar el servicio. Por favor, inténtelo de nuevo más tarde.');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg my-8 form-input">
            <h2 className="text-xl font-bold mb-4">Solicitar Servicio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label>Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label>Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                        rows={4}
                        required
                    />
                </div>

                {/* Municipality */}
                <div>
                    <label>Municipio</label>
                    <select
                        name="municipality"
                        value={formData.municipality}
                        onChange={handleInputChange}
                        className="select-dropdown"
                        required
                    >
                        <option value="">Seleccionar Municipio</option>
                        {handyman.coverageArea.map((area, index) => (
                            <option key={index} value={area}>
                                {area}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Neighborhood */}
                <div>
                    <label>Barrio</label>
                    <select
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        className="select-dropdown"
                        required
                        disabled={!formData.municipality}
                    >
                        <option value="">Seleccionar Barrio</option>
                        {selectedMunicipality?.neighborhoods.map((neighborhood, index) => (
                            <option key={index} value={neighborhood}>
                                {neighborhood}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Address */}
                <div>
                    <label>Dirección</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label>Categoría</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="select-dropdown"
                        required
                    >
                        <option value="">Seleccionar Categoría</option>
                        {handyman.skills.map((skill, index) => (
                            <option key={index} value={skill.skillName}>
                                {skill.skillName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="semiround-green-button"
                        style={{ margin: '0 auto', display: 'block' }}
                    >
                        Solicitar
                    </button>
                </div>
            </form>
        </div>
    );
}
