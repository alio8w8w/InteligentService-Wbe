// components/admin/ProductForm.tsx

import React, { useState } from "react";

type Brand = "Hikvision" | "Dahua";

const AVAILABLE_BRANDS: Brand[] = ["Hikvision", "Dahua"];
const LANGUAGES = [
  { code: "ro", name: "Română" },
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" }, // exemplu, adaptează la stack-ul i18n
];

export default function ProductForm() {
  // State pentru toate câmpurile
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [brand, setBrand] = useState<Brand>("Hikvision");
  const [discount, setDiscount] = useState<number | "">("");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Helpers pentru image upload (local state, upload eventually in API endpoint)
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Construiește "FormData" pentru imagini și date
    const formData = new FormData();
    // images multiple
    images.forEach((file, idx) => formData.append("images", file));
    formData.append("name", name);
    formData.append("base_price", String(basePrice));
    formData.append("brand", brand);
    formData.append("discount_percentage", discount ? String(discount) : "");
    formData.append("is_featured_on_homepage", String(featured));
    formData.append("description", description);

    // Trimite către API Route
    try {
      const res = await fetch("/api/translate-and-add-product", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Eroare la adăugare produs");
      }

      setSuccess("Produs adăugat cu succes!");
      // reset form
      setName("");
      setBasePrice(0);
      setBrand("Hikvision");
      setDiscount("");
      setFeatured(false);
      setDescription("");
      setImages([]);
    } catch (err: any) {
      setError(err.message || "Eroare necunoscută");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-lg bg-[#191A21] p-8 rounded-xl space-y-6"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-lg font-semibold mb-4">Adaugă produs nou</h2>
      <div className="space-y-2">
        <label className="block">Nume produs*</label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 rounded bg-[#232336]"
        />
      </div>

      <div className="space-y-2">
        <label className="block">Preț de bază (MDL)*</label>
        <input
          type="number"
          required
          min={0}
          value={basePrice}
          onChange={e => setBasePrice(Number(e.target.value))}
          className="w-full p-2 rounded bg-[#232336]"
        />
      </div>

      <div className="space-y-2">
        <label className="block">Imagini (upload multiplu)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />
      </div>

      <div className="space-y-2">
        <label className="block">Brand *</label>
        <select
          value={brand}
          onChange={e => setBrand(e.target.value as Brand)}
          className="w-full p-2 rounded bg-[#232336]"
        >
          {AVAILABLE_BRANDS.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block">Reducere (%)</label>
        <input
          type="number"
          step={0.01}
          min={0}
          max={100}
          value={discount}
          onChange={e => setDiscount(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full p-2 rounded bg-[#232336]"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={featured}
          onChange={e => setFeatured(e.target.checked)}
          id="featured"
        />
        <label htmlFor="featured" className="ml-2 cursor-pointer">
          Afișează pe pagina principală
        </label>
      </div>

      <div className="space-y-2">
        <label className="block">Descriere produs* (va fi tradusă automat)</label>
        <textarea
          required
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-[#232336]"
          rows={4}
        />
      </div>
    
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? "Salvez..." : "Adaugă produs"}
      </button>
    </form>
  );
}