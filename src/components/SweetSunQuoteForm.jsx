import React, { useState, useRef } from 'react';
import { Upload, Check, ChevronRight, ChevronLeft, Home, Ruler, Settings, Palette, Send, MessageCircle } from 'lucide-react';

const SweetSunQuoteForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        nombre: '', email: '', whatsapp: '', ambiente: '',
        tieneBarralRiel: '', sistemaUsar: '', altoMedida: '', anchoMedida: '',
        tipoTela: '', tipoConfeccion: '', estiloQueden: '', instalacion: '',
        coloresPreferidos: '', comentarios: '', fotos: []
    });

    const [errors, setErrors] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Steps definition (Removed Presupuesto from the logic, though kept in "Preferencias" title)
    const steps = [
        { title: 'Datos de Contacto', icon: Home, fields: ['nombre', 'email', 'whatsapp', 'ambiente'] },
        { title: 'Sistema y Medidas', icon: Ruler, fields: ['tieneBarralRiel', 'sistemaUsar', 'altoMedida', 'anchoMedida'] },
        { title: 'Diseño y Estilo', icon: Settings, fields: ['tipoTela', 'tipoConfeccion', 'estiloQueden', 'instalacion'] },
        { title: 'Preferencias', icon: Palette, fields: ['coloresPreferidos', 'comentarios'] }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (uploadedFiles.length + files.length > 5) {
            alert('Máximo 5 archivos permitidos');
            return;
        }
        setUploadedFiles(prev => [...prev, ...files.slice(0, 5 - prev.length)]);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep = () => {
        const currentFields = steps[currentStep].fields;
        const newErrors = {};

        currentFields.forEach(field => {
            // Skip sistemaUsar if they have Barral/Riel
            if (field === 'sistemaUsar' && formData.tieneBarralRiel === 'Si') return;

            if (!formData[field]) {
                newErrors[field] = 'Este campo es requerido';
            }
        });

        if (currentStep === 0) {
            if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
            if (formData.whatsapp && !/^\d{10,15}$/.test(formData.whatsapp.replace(/\s/g, ''))) newErrors.whatsapp = 'Número inválido (10-15 dígitos)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        // Here you would typically send data to a backend
        console.log('Form Data:', formData);
        console.log('Files:', uploadedFiles);

        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getWhatsappMessage = (isClient = false) => {
        const text = `
*NUEVA COTIZACIÓN - SWEET SUN*
-----------------------------
*Cliente:* ${formData.nombre}
*Email:* ${formData.email}
*WhatsApp:* ${formData.whatsapp}
*Ambiente:* ${formData.ambiente}

*Sistema:* ${formData.tieneBarralRiel === 'Si' ? 'Ya tiene instalado' : formData.sistemaUsar}
*Medidas:* ${formData.anchoMedida}m ancho x ${formData.altoMedida}m alto

*Tela:* ${formData.tipoTela}
*Confección:* ${formData.tipoConfeccion}
*Caída:* ${formData.estiloQueden}
*Color:* ${formData.coloresPreferidos}
*Instalación:* ${formData.instalacion}

${formData.comentarios ? `*Comentarios:* ${formData.comentarios}` : ''}
    `.trim();
        return encodeURIComponent(text);
    };

    const StepIcon = steps[currentStep].icon;

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-custom flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full text-center animate-fadeIn">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-serif text-stone-800 mb-4">¡Cotización Generada!</h2>
                    <p className="text-stone-600 mb-8">
                        Gracias por completar el formulario. Hemos recopilado toda la información necesaria para tu presupuesto.
                    </p>

                    <div className="space-y-4">
                        <a
                            href={`https://wa.me/5491133230321?text=${getWhatsappMessage()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <MessageCircle className="w-6 h-6" />
                            Enviar Pedido por WhatsApp
                        </a>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 text-stone-500 hover:text-stone-700 underline"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div >
        );
    }

    return (
        <div className="min-h-screen bg-gradient-custom">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <img src="/logo.jpg" alt="Sweet Sun Logo" className="h-40 w-auto mx-auto object-contain mix-blend-multiply" />
                            {/* Fallback text if image acts up, but image is preferred */}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12 animate-fadeIn">
                    <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
                        Cortinas a Medida
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        Transformá tus espacios con cortinas diseñadas exclusivamente para vos.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center relative z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${index === currentStep ? 'bg-amber-600 text-white scale-110 shadow-lg' :
                                        index < currentStep ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'
                                        }`}>
                                        {index < currentStep ? <Check size={20} /> : <step.icon size={20} />}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${index === currentStep ? 'text-amber-700' : 'text-stone-500'}`}>
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 -mt-4 transition-all duration-300 ${index < currentStep ? 'bg-emerald-500' : 'bg-stone-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-stone-100">
                    <div className="mb-8 md:hidden flex items-center gap-3 border-b border-stone-100 pb-4">
                        <StepIcon className="text-amber-600" size={24} />
                        <h3 className="text-xl font-serif text-stone-800">{steps[currentStep].title}</h3>
                    </div>

                    {/* Step 0: Contact Info */}
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-slideIn">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Nombre y Apellido *</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.nombre ? 'border-red-400' : 'border-stone-300'} focus:ring-2 focus:ring-amber-500 outline-none`}
                                    placeholder="Ej: María González"
                                />
                                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-stone-300'} focus:ring-2 focus:ring-amber-500 outline-none`}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">WhatsApp *</label>
                                <input
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.whatsapp ? 'border-red-400' : 'border-stone-300'} focus:ring-2 focus:ring-amber-500 outline-none`}
                                    placeholder="11 2345 6789"
                                />
                                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Ambiente *</label>
                                <input
                                    type="text"
                                    value={formData.ambiente}
                                    onChange={(e) => handleInputChange('ambiente', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.ambiente ? 'border-red-400' : 'border-stone-300'} focus:ring-2 focus:ring-amber-500 outline-none`}
                                    placeholder="Ej: Living, Dormitorio"
                                />
                                {errors.ambiente && <p className="text-red-500 text-xs mt-1">{errors.ambiente}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 1: System & Measures */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-slideIn">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-3">¿Tenés instalado el riel o barral? *</label>
                                <div className="flex gap-4">
                                    {['Si', 'No'].map(option => (
                                        <label key={option} className="flex-1 border p-4 rounded-lg cursor-pointer hover:border-amber-400 transition-colors has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50">
                                            <input
                                                type="radio"
                                                name="tieneBarralRiel"
                                                value={option}
                                                checked={formData.tieneBarralRiel === option}
                                                onChange={(e) => handleInputChange('tieneBarralRiel', e.target.value)}
                                                className="hidden"
                                            />
                                            <span className="block text-center font-medium">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.tieneBarralRiel && <p className="text-red-500 text-xs mt-1">{errors.tieneBarralRiel}</p>}
                            </div>

                            {formData.tieneBarralRiel === 'No' && (
                                <div className="animate-fadeIn">
                                    <label className="block text-sm font-medium text-stone-700 mb-3">¿Qué sistema vas a usar? *</label>
                                    <div className="flex gap-4">
                                        {['Riel', 'Barral'].map(option => (
                                            <label key={option} className="flex-1 border p-4 rounded-lg cursor-pointer hover:border-amber-400 transition-colors has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50">
                                                <input
                                                    type="radio"
                                                    name="sistemaUsar"
                                                    value={option}
                                                    checked={formData.sistemaUsar === option}
                                                    onChange={(e) => handleInputChange('sistemaUsar', e.target.value)}
                                                    className="hidden"
                                                />
                                                <span className="block text-center font-medium">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.sistemaUsar && <p className="text-red-500 text-xs mt-1">{errors.sistemaUsar}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Alto (mts) *</label>
                                    <input
                                        type="text"
                                        value={formData.altoMedida}
                                        onChange={(e) => handleInputChange('altoMedida', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="2.50"
                                    />
                                    {errors.altoMedida && <p className="text-red-500 text-xs mt-1">{errors.altoMedida}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Ancho (mts) *</label>
                                    <input
                                        type="text"
                                        value={formData.anchoMedida}
                                        onChange={(e) => handleInputChange('anchoMedida', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="3.00"
                                    />
                                    {errors.anchoMedida && <p className="text-red-500 text-xs mt-1">{errors.anchoMedida}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Design */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-slideIn">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-3">Tipo de tela *</label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'Gasa de algodón', desc: 'Ligera, deja pasar luz natural' },
                                        { value: 'Blackout 100%', desc: 'Oscuridad total' },
                                        { value: 'Mix (Gasa + Blackout)', desc: 'Doble cortina' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-stone-50 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                            <input
                                                type="radio"
                                                name="tipoTela"
                                                value={option.value}
                                                checked={formData.tipoTela === option.value}
                                                onChange={(e) => handleInputChange('tipoTela', e.target.value)}
                                                className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                                            />
                                            <div>
                                                <span className="block font-medium text-stone-800">{option.value}</span>
                                                <span className="text-xs text-stone-500">{option.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.tipoTela && <p className="text-red-500 text-xs mt-1">{errors.tipoTela}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-3">Tipo de confección *</label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'Fruncida', desc: 'Clásica, pliegues continuos' },
                                        { value: 'En tablas', desc: 'Elegante, pliegues simétricos' },
                                        // Lisa only if NOT using Riel (so allowed if Barral or Unknown/Si)
                                        ...(formData.sistemaUsar !== 'Riel' ? [{ value: 'Lisa', desc: 'Minimalista, para barral' }] : [])
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-stone-50 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                            <input
                                                type="radio"
                                                name="tipoConfeccion"
                                                value={option.value}
                                                checked={formData.tipoConfeccion === option.value}
                                                onChange={(e) => handleInputChange('tipoConfeccion', e.target.value)}
                                                className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                                            />
                                            <div>
                                                <span className="block font-medium text-stone-800">{option.value}</span>
                                                <span className="text-xs text-stone-500">{option.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.tipoConfeccion && <p className="text-red-500 text-xs mt-1">{errors.tipoConfeccion}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-3">Caída en el suelo *</label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'Sin arrastre', desc: 'Justo a ras del suelo' },
                                        { value: 'Ligero arrastre (5 cm)', desc: 'Toque romántico' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-stone-50 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                            <input
                                                type="radio"
                                                name="estiloQueden"
                                                value={option.value}
                                                checked={formData.estiloQueden === option.value}
                                                onChange={(e) => handleInputChange('estiloQueden', e.target.value)}
                                                className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                                            />
                                            <div>
                                                <span className="block font-medium text-stone-800">{option.value}</span>
                                                <span className="text-xs text-stone-500">{option.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.estiloQueden && <p className="text-red-500 text-xs mt-1">{errors.estiloQueden}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-3">Instalación *</label>
                                <div className="flex gap-4">
                                    {['En techo', 'En pared'].map(option => (
                                        <label key={option} className="flex-1 border p-3 rounded-lg cursor-pointer hover:border-amber-400 text-center has-[:checked]:bg-amber-50 has-[:checked]:border-amber-600">
                                            <input
                                                type="radio"
                                                name="instalacion"
                                                value={option}
                                                checked={formData.instalacion === option}
                                                onChange={(e) => handleInputChange('instalacion', e.target.value)}
                                                className="hidden"
                                            />
                                            <span className="font-medium text-stone-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.instalacion && <p className="text-red-500 text-xs mt-1">{errors.instalacion}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Preferences */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-slideIn">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-3">Color preferido *</label>
                                <div className="flex gap-4">
                                    {['Blanco Tiza', 'Crudo'].map(option => (
                                        <label key={option} className="flex-1 border p-4 rounded-lg cursor-pointer hover:border-amber-400 text-center has-[:checked]:bg-amber-50 has-[:checked]:border-amber-600">
                                            <input
                                                type="radio"
                                                name="coloresPreferidos"
                                                value={option}
                                                checked={formData.coloresPreferidos === option}
                                                onChange={(e) => handleInputChange('coloresPreferidos', e.target.value)}
                                                className="hidden"
                                            />
                                            <span className="font-medium text-stone-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.coloresPreferidos && <p className="text-red-500 text-xs mt-1">{errors.coloresPreferidos}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Subí fotos de tu ventana (opcional)
                                </label>
                                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="fileUpload"
                                    />
                                    <label htmlFor="fileUpload" className="cursor-pointer">
                                        <Upload className="mx-auto mb-2 text-amber-600" size={32} />
                                        <p className="text-stone-600 font-medium text-sm">Click para subir (Máx 5)</p>
                                    </label>
                                </div>
                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 rounded text-sm">
                                                <span className="truncate max-w-[200px]">{file.name}</span>
                                                <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">Eliminar</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Comentarios adicionales</label>
                                <textarea
                                    value={formData.comentarios}
                                    onChange={(e) => handleInputChange('comentarios', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                    placeholder="Detalles extra..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-8 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${currentStep === 0 ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                                }`}
                        >
                            <ChevronLeft size={20} />
                            Anterior
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 shadow-md transform hover:-translate-y-0.5 transition-all"
                            >
                                Siguiente
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <Send size={20} />
                                Enviar Cotización
                            </button>
                        )}
                    </div>
                </form>
            </main>

            <footer className="text-center py-8 text-stone-500 text-sm space-y-2">
                <p>© 2025 Sweet Sun Home & Deco</p>
                <div className="flex items-center justify-center gap-4">
                    <a href="https://www.instagram.com/sweetsun.deco" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors font-medium">
                        @sweetsun.deco
                    </a>
                    <span className="text-stone-300">|</span>
                    <a href="https://wa.me/5491133230321" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors font-medium">
                        WhatsApp: 11 3323 0321
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default SweetSunQuoteForm;
