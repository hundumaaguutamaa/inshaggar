"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/admin/admin.module.css";
import { 
    Save, Plus, Trash, ArrowLeft, MapPin, AlertTriangle, 
    FileText, Clock, Banknote, Users, CheckCircle, Info,
    Building, Globe, Calendar
} from "lucide-react";
import Link from "next/link";

interface Step {
    title: string;
    description: string;
}

interface Document {
    name: string;
    type: string;
    count: number;
    notes: string;
}

interface Location {
    name: string;
    subCity: string;
    woreda: string;
    workingHours: string;
}

interface Mistake {
    description: string;
}

interface ProcedureFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ProcedureForm({ initialData, isEditing = false }: ProcedureFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        category: initialData?.category || "Identity & Travel",
        overview: initialData?.overview || "",
        eligibility: initialData?.eligibility || "",
        city: initialData?.city || "Addis Ababa",
        estimatedCost: initialData?.estimatedCost || "",
        estimatedDuration: initialData?.estimatedDuration || "",
        status: initialData?.status || "DRAFT",
    });

    const [steps, setSteps] = useState<Step[]>(
        initialData?.steps?.map((s: any) => ({ title: s.title, description: s.description })) ||
        [{ title: "", description: "" }]
    );

    const [docs, setDocs] = useState<Document[]>(
        initialData?.requiredDocuments?.map((d: any) => ({
            name: d.name,
            type: d.type,
            count: d.count,
            notes: d.notes || ""
        })) ||
        [{ name: "", type: "Original", count: 1, notes: "" }]
    );

    const [locations, setLocations] = useState<Location[]>(
        initialData?.officeLocations?.map((l: any) => ({
            name: l.name,
            subCity: l.subCity || "",
            woreda: l.woreda || "",
            workingHours: l.workingHours || "8:30 AM - 5:30 PM"
        })) || []
    );

    const [mistakes, setMistakes] = useState<Mistake[]>(
        initialData?.commonMistakes?.map((m: any) => ({ description: m.description })) || []
    );

    const addStep = () => setSteps([...steps, { title: "", description: "" }]);
    const removeStep = (index: number) => {
        if (steps.length > 1) {
            const newSteps = [...steps];
            newSteps.splice(index, 1);
            setSteps(newSteps);
        }
    };

    const addDoc = () => setDocs([...docs, { name: "", type: "Original", count: 1, notes: "" }]);
    const removeDoc = (index: number) => {
        if (docs.length > 1) {
            const newDocs = [...docs];
            newDocs.splice(index, 1);
            setDocs(newDocs);
        }
    };

    const addLocation = () => setLocations([...locations, { name: "", subCity: "", woreda: "", workingHours: "8:30 AM - 5:30 PM" }]);
    const removeLocation = (index: number) => {
        const newLocations = [...locations];
        newLocations.splice(index, 1);
        setLocations(newLocations);
    };

    const addMistake = () => setMistakes([...mistakes, { description: "" }]);
    const removeMistake = (index: number) => {
        const newMistakes = [...mistakes];
        newMistakes.splice(index, 1);
        setMistakes(newMistakes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            steps,
            requiredDocuments: docs,
            officeLocations: locations,
            commonMistakes: mistakes
        };

        try {
            const url = isEditing ? `/api/procedures/${initialData.id}` : '/api/procedures';
            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate completion progress
    const totalSections = 5;
    const completedSections = [
        formData.title && formData.overview,
        steps.some(s => s.title && s.description),
        docs.some(d => d.name),
        locations.length > 0,
        mistakes.length > 0
    ].filter(Boolean).length;

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            {/* Enhanced Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <FileText size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className={styles.title}>
                            {isEditing ? 'Edit Procedure' : 'Create New Procedure'}
                        </h1>
                        <p className="text-[hsl(var(--muted-foreground))] font-medium">
                            Build a comprehensive guide for Ethiopian government services
                        </p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className={styles.progressIndicator}>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-600" />
                        <span className="font-semibold">Progress: {completedSections}/{totalSections} sections</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 ml-4">
                        <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(completedSections / totalSections) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                        {Math.round((completedSections / totalSections) * 100)}%
                    </span>
                </div>
            </header>

            {/* Section 1: Basic Information */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>1</div>
                    <div>
                        <h2 className={styles.sectionTitle}>Basic Information</h2>
                        <p className={styles.sectionDescription}>Essential details about the service</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={`${styles.label} ${styles.labelRequired}`}>
                            Service Name
                            <span className={styles.labelHelper}>Clear, descriptive name for the government service</span>
                        </label>
                        <input
                            required
                            className={styles.input}
                            placeholder="e.g., New Passport Application"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className={styles.row}>
                        <div>
                            <label className={`${styles.label} ${styles.labelRequired}`}>
                                Category
                                <span className={styles.labelHelper}>Service classification</span>
                            </label>
                            <select
                                className={styles.select}
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Identity & Travel">🛂 Identity & Travel</option>
                                <option value="Civil Status">👥 Civil Status</option>
                                <option value="Education">🎓 Education</option>
                                <option value="Business">💼 Business</option>
                                <option value="Legal">⚖️ Legal</option>
                                <option value="Health">🏥 Health</option>
                                <option value="Property">🏠 Property</option>
                            </select>
                        </div>
                        <div>
                            <label className={styles.label}>
                                Publication Status
                                <span className={styles.labelHelper}>Visibility to public users</span>
                            </label>
                            <select
                                className={styles.select}
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="DRAFT">📝 Draft (Hidden)</option>
                                <option value="PUBLISHED">✅ Published (Live)</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row3}>
                        <div>
                            <label className={styles.label}>
                                <Banknote size={16} className="inline mr-2" />
                                Processing Fee
                                <span className={styles.labelHelper}>Cost in Ethiopian Birr</span>
                            </label>
                            <input
                                className={styles.input}
                                placeholder="e.g., 2,000 ETB"
                                value={formData.estimatedCost}
                                onChange={e => setFormData({ ...formData, estimatedCost: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>
                                <Clock size={16} className="inline mr-2" />
                                Processing Time
                                <span className={styles.labelHelper}>Expected duration</span>
                            </label>
                            <input
                                className={styles.input}
                                placeholder="e.g., 15 working days"
                                value={formData.estimatedDuration}
                                onChange={e => setFormData({ ...formData, estimatedDuration: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>
                                <Globe size={16} className="inline mr-2" />
                                City/Region
                                <span className={styles.labelHelper}>Primary location</span>
                            </label>
                            <select
                                className={styles.select}
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                            >
                                <option value="Addis Ababa">Addis Ababa</option>
                                <option value="Dire Dawa">Dire Dawa</option>
                                <option value="Bahir Dar">Bahir Dar</option>
                                <option value="Mekelle">Mekelle</option>
                                <option value="Hawassa">Hawassa</option>
                                <option value="Adama">Adama</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={`${styles.label} ${styles.labelRequired}`}>
                            Service Overview
                            <span className={styles.labelHelper}>Brief description of what this service provides</span>
                        </label>
                        <textarea
                            required
                            className={styles.textarea}
                            placeholder="Describe what this service is for, who needs it, and what it accomplishes..."
                            value={formData.overview}
                            onChange={e => setFormData({ ...formData, overview: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={`${styles.label} ${styles.labelRequired}`}>
                            <Users size={16} className="inline mr-2" />
                            Eligibility Requirements
                            <span className={styles.labelHelper}>Who can apply for this service</span>
                        </label>
                        <textarea
                            required
                            className={styles.textarea}
                            placeholder="List who is eligible, age requirements, citizenship status, etc..."
                            value={formData.eligibility}
                            onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Step-by-Step Process */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>2</div>
                    <div>
                        <h2 className={styles.sectionTitle}>Step-by-Step Process</h2>
                        <p className={styles.sectionDescription}>Detailed instructions for completing the service</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={addStep} 
                        className={styles.addButton}
                    >
                        <Plus size={16} /> Add Step
                    </button>
                </div>

                <div className="space-y-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className={styles.dynamicItem}>
                            <div className={styles.dynamicItemHeader}>
                                <div className="flex items-center gap-3">
                                    <div className={styles.dynamicItemNumber}>{idx + 1}</div>
                                    <h3 className={styles.dynamicItemTitle}>Step {idx + 1}</h3>
                                </div>
                                {steps.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeStep(idx)} 
                                        className={styles.removeButton}
                                        title="Remove this step"
                                    >
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className={styles.label}>
                                        Step Title
                                        <span className={styles.labelHelper}>Clear, action-oriented title</span>
                                    </label>
                                    <input
                                        placeholder="e.g., Submit Application Form"
                                        className={styles.input}
                                        value={step.title}
                                        onChange={e => {
                                            const newSteps = [...steps];
                                            newSteps[idx].title = e.target.value;
                                            setSteps(newSteps);
                                        }}
                                    />
                                </div>
                                
                                <div>
                                    <label className={styles.label}>
                                        Detailed Instructions
                                        <span className={styles.labelHelper}>What exactly should the user do in this step</span>
                                    </label>
                                    <textarea
                                        placeholder="Provide detailed instructions for this step..."
                                        className={styles.textarea}
                                        value={step.description}
                                        onChange={e => {
                                            const newSteps = [...steps];
                                            newSteps[idx].description = e.target.value;
                                            setSteps(newSteps);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 3: Required Documents */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>3</div>
                    <div>
                        <h2 className={styles.sectionTitle}>Required Documents</h2>
                        <p className={styles.sectionDescription}>What applicants need to bring</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={addDoc} 
                        className={styles.addButton}
                    >
                        <Plus size={16} /> Add Document
                    </button>
                </div>

                <div className="space-y-4">
                    {docs.map((doc, idx) => (
                        <div key={idx} className={styles.dynamicItem}>
                            <div className={styles.dynamicItemHeader}>
                                <div className="flex items-center gap-3">
                                    <div className={styles.dynamicItemNumber}>{idx + 1}</div>
                                    <h3 className={styles.dynamicItemTitle}>Document {idx + 1}</h3>
                                </div>
                                {docs.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeDoc(idx)} 
                                        className={styles.removeButton}
                                        title="Remove this document"
                                    >
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>
                            
                            <div className={styles.row}>
                                <div>
                                    <label className={styles.label}>
                                        Document Name
                                        <span className={styles.labelHelper}>Official name of the document</span>
                                    </label>
                                    <input
                                        placeholder="e.g., Birth Certificate"
                                        className={styles.input}
                                        value={doc.name}
                                        onChange={e => {
                                            const newDocs = [...docs];
                                            newDocs[idx].name = e.target.value;
                                            setDocs(newDocs);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>
                                        Document Type
                                        <span className={styles.labelHelper}>Original, copy, or certified copy</span>
                                    </label>
                                    <select
                                        className={styles.select}
                                        value={doc.type}
                                        onChange={e => {
                                            const newDocs = [...docs];
                                            newDocs[idx].type = e.target.value;
                                            setDocs(newDocs);
                                        }}
                                    >
                                        <option value="Original">📄 Original</option>
                                        <option value="Copy">📋 Copy</option>
                                        <option value="Certified Copy">✅ Certified Copy</option>
                                        <option value="Notarized">🏛️ Notarized</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div>
                                    <label className={styles.label}>
                                        Quantity Required
                                        <span className={styles.labelHelper}>How many copies needed</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        className={styles.input}
                                        value={doc.count}
                                        onChange={e => {
                                            const newDocs = [...docs];
                                            newDocs[idx].count = parseInt(e.target.value) || 1;
                                            setDocs(newDocs);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>
                                        Additional Notes
                                        <span className={styles.labelHelper}>Special requirements or conditions</span>
                                    </label>
                                    <input
                                        placeholder="e.g., Must be issued within last 6 months"
                                        className={styles.input}
                                        value={doc.notes}
                                        onChange={e => {
                                            const newDocs = [...docs];
                                            newDocs[idx].notes = e.target.value;
                                            setDocs(newDocs);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 4: Office Locations */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>4</div>
                    <div>
                        <h2 className={styles.sectionTitle}>
                            <MapPin size={20} className="inline mr-2" />
                            Office Locations
                        </h2>
                        <p className={styles.sectionDescription}>Where applicants can complete this service</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={addLocation} 
                        className={styles.addButton}
                    >
                        <Plus size={16} /> Add Location
                    </button>
                </div>

                <div className="space-y-4">
                    {locations.map((loc, idx) => (
                        <div key={idx} className={styles.dynamicItem}>
                            <div className={styles.dynamicItemHeader}>
                                <div className="flex items-center gap-3">
                                    <div className={styles.dynamicItemNumber}>{idx + 1}</div>
                                    <h3 className={styles.dynamicItemTitle}>Location {idx + 1}</h3>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeLocation(idx)} 
                                    className={styles.removeButton}
                                    title="Remove this location"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                            
                            <div className={styles.row}>
                                <div>
                                    <label className={styles.label}>
                                        <Building size={16} className="inline mr-2" />
                                        Office Name
                                        <span className={styles.labelHelper}>Official name of the office or branch</span>
                                    </label>
                                    <input
                                        placeholder="e.g., Immigration Office - Bole Branch"
                                        className={styles.input}
                                        value={loc.name}
                                        onChange={e => {
                                            const newLocs = [...locations];
                                            newLocs[idx].name = e.target.value;
                                            setLocations(newLocs);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>
                                        <Calendar size={16} className="inline mr-2" />
                                        Working Hours
                                        <span className={styles.labelHelper}>When the office is open</span>
                                    </label>
                                    <input
                                        placeholder="e.g., 8:30 AM - 5:30 PM"
                                        className={styles.input}
                                        value={loc.workingHours}
                                        onChange={e => {
                                            const newLocs = [...locations];
                                            newLocs[idx].workingHours = e.target.value;
                                            setLocations(newLocs);
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div>
                                    <label className={styles.label}>
                                        Sub-City
                                        <span className={styles.labelHelper}>Administrative sub-city (optional)</span>
                                    </label>
                                    <input
                                        placeholder="e.g., Bole"
                                        className={styles.input}
                                        value={loc.subCity}
                                        onChange={e => {
                                            const newLocs = [...locations];
                                            newLocs[idx].subCity = e.target.value;
                                            setLocations(newLocs);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>
                                        Woreda
                                        <span className={styles.labelHelper}>Local administrative area (optional)</span>
                                    </label>
                                    <input
                                        placeholder="e.g., Woreda 03"
                                        className={styles.input}
                                        value={loc.woreda}
                                        onChange={e => {
                                            const newLocs = [...locations];
                                            newLocs[idx].woreda = e.target.value;
                                            setLocations(newLocs);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 5: Common Mistakes */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>5</div>
                    <div>
                        <h2 className={styles.sectionTitle}>
                            <AlertTriangle size={20} className="inline mr-2" />
                            Common Mistakes to Avoid
                        </h2>
                        <p className={styles.sectionDescription}>Help users avoid typical pitfalls</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={addMistake} 
                        className={styles.addButton}
                    >
                        <Plus size={16} /> Add Warning
                    </button>
                </div>

                <div className="space-y-4">
                    {mistakes.map((mistake, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                            <div className="flex-1">
                                <label className={styles.label}>
                                    Common Mistake #{idx + 1}
                                    <span className={styles.labelHelper}>Describe what users often do wrong</span>
                                </label>
                                <input
                                    placeholder="e.g., Bringing expired documents or incorrect photo sizes"
                                    className={styles.input}
                                    value={mistake.description}
                                    onChange={e => {
                                        const newMistakes = [...mistakes];
                                        newMistakes[idx].description = e.target.value;
                                        setMistakes(newMistakes);
                                    }}
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeMistake(idx)} 
                                className={styles.removeButton}
                                style={{ marginTop: '2rem' }}
                                title="Remove this warning"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
                <Link 
                    href="/admin" 
                    className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] font-medium transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
                
                <button
                    type="submit"
                    disabled={loading}
                    className={styles.saveButton}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            {isEditing ? 'Update Procedure' : 'Create Procedure'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
