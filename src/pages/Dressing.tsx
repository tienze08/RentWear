import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    Upload,
    Camera,
    X,
    Shirt,
    User,
    ChevronDown,
    Maximize2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRental } from "@/components/contexts/RentalContext";


interface UploadedImage {
    id: string;
    url: string;
    name: string;
    file: File;
}

// const sampleClothes = [
//     {
//         id: "sample1",
//         url: "https://res.cloudinary.com/dns6shagj/image/upload/v1752682139/fashion-rental/oba0mfrpkb9prktjkqvo.jpg",
//         name: "Đầm ren cổ vuông",
//         type: "full",
//     },
//     {
//         id: "sample2",
//         url: "https://res.cloudinary.com/dns6shagj/image/upload/v1752681590/fashion-rental/umnl2fhu9gdceoofh04a.jpg",
//         name: "Đầm hai dây",
//         type: "upper",
//     },
// ];


function Dressing() {
    const { rentals, fetchMyRentals } = useRental();
    const [modelImages, setModelImages] = useState<UploadedImage[]>([]);
    const [clothImages, setClothImages] = useState<UploadedImage[]>([]);
    const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(
        null
    );
    const [selectedClothIndex, setSelectedClothIndex] = useState<number | null>(
        null
    );
    const [clothType, setClothType] = useState<"upper" | "lower" | "full">(
        "upper"
    );
    const [resultUrl, setResultUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [statusMsg, setStatusMsg] = useState<string>("");
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [viewImageModal, setViewImageModal] = useState({
        open: false,
        url: "",
        title: "",
    });

    const modelInputRef = useRef<HTMLInputElement>(null);
    const clothInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMyRentals();
    }, []);
    const filteredRentals = rentals.filter((rental) => rental.status === "PENDING");
    const products = filteredRentals.map((rental) => { return rental.productId });
    console.log("products: ", products);
    const sampleClothes = products.map((product) => ({
        id: product._id,
        name: product.name,
        url: product.images[0],
        type: "full"
    }));
    console.log("Sample clothes: ",sampleClothes)

    const addSampleCloth = (sample: (typeof sampleClothes)[0]) => {
        // Tạo một File object giả từ URL ảnh mẫu
        fetch(sample.url)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], sample.name, { type: blob.type });
                const newImage = {
                    id: sample.id,
                    url: sample.url,
                    name: sample.name,
                    file: file,
                };

                setClothImages((prev) => [...prev, newImage]);
                if (selectedClothIndex === null) {
                    setSelectedClothIndex(0);
                }
                setClothType(sample.type as any);
            })
            .catch((err) => {
                console.error("Error loading sample image:", err);
            });
    };

    const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newImages = files.map((file) => ({
                id: Date.now() + Math.random().toString(),
                url: URL.createObjectURL(file),
                name: file.name,
                file: file,
            }));

            setModelImages((prev) => [...prev, ...newImages]);
            if (selectedModelIndex === null) {
                setSelectedModelIndex(0);
            }
        }
    };

    const handleClothUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newImages = files.map((file) => ({
                id: Date.now() + Math.random().toString(),
                url: URL.createObjectURL(file),
                name: file.name,
                file: file,
            }));

            setClothImages((prev) => [...prev, ...newImages]);
            if (selectedClothIndex === null) {
                setSelectedClothIndex(0);
            }
        }
    };

    const triggerModelInput = () => {
        modelInputRef.current?.click();
    };

    const triggerClothInput = () => {
        clothInputRef.current?.click();
    };

    const removeModelImage = (index: number) => {
        setModelImages((prev) => prev.filter((_, i) => i !== index));
        if (selectedModelIndex === index) {
            setSelectedModelIndex(
                modelImages.length > 1 ? Math.max(0, index - 1) : null
            );
        } else if (selectedModelIndex !== null && selectedModelIndex > index) {
            setSelectedModelIndex(selectedModelIndex - 1);
        }
    };

    const removeClothImage = (index: number) => {
        setClothImages((prev) => prev.filter((_, i) => i !== index));
        if (selectedClothIndex === index) {
            setSelectedClothIndex(
                clothImages.length > 1 ? Math.max(0, index - 1) : null
            );
        } else if (selectedClothIndex !== null && selectedClothIndex > index) {
            setSelectedClothIndex(selectedClothIndex - 1);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "upper":
                return <Shirt className="w-4 h-4" />;
            case "lower":
                return <Shirt className="w-4 h-4" />;
            case "full":
                return <User className="w-4 h-4" />;
            default:
                return <Shirt className="w-4 h-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "upper":
                return "Upper Body";
            case "lower":
                return "Lower Body";
            case "full":
                return "Full Body";
            default:
                return type;
        }
    };

    const openImageModal = (url: string, title: string) => {
        setViewImageModal({
            open: true,
            url,
            title,
        });
    };

    const closeImageModal = () => {
        setViewImageModal({
            open: false,
            url: "",
            title: "",
        });
    };

    const handleSubmit = async () => {
        if (selectedModelIndex === null || selectedClothIndex === null) {
            setErrorMsg("Vui lòng chọn ảnh người mẫu và quần áo để thử");
            return;
        }

        const modelImage = modelImages[selectedModelIndex];
        const clothImage = clothImages[selectedClothIndex];

        const formData = new FormData();
        formData.append("model_image", modelImage.file);
        formData.append("cloth_image", clothImage.file);
        formData.append("cloth_type", clothType);

        try {
            setLoading(true);
            setErrorMsg("");
            setResultUrl("");
            setStatusMsg("🚀 Đang khởi tạo quá trình thử đồ...");

            const response = await axios.post(
                "https://platform.fitroom.app/api/tryon/v2/tasks",
                formData,
                {
                    headers: {
                        "X-API-KEY":
                            "b6afb8cf0e4248248f07bca89d321bfd8b44e9355e27c9dd700b2059f47bba49",
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const taskId = response.data.task_id;
            setStatusMsg("⏳ Hệ thống đang xử lý ảnh của bạn...");

            let attempts = 0;
            const maxAttempts = 30;
            const interval = setInterval(async () => {
                try {
                    const statusRes = await axios.get(
                        `https://platform.fitroom.app/api/tryon/v2/tasks/${taskId}`,
                        {
                            headers: {
                                "X-API-KEY":
                                    "38f436e1fb294a5bb62268350044db75f3f14b5003b4c21d434a14fa6b1184ba",
                            },
                        }
                    );

                    const taskStatus = statusRes.data.status;
                    setStatusMsg(
                        `🔄 Đang xử lý: ${taskStatus.toLowerCase()}...`
                    );

                    if (taskStatus.toUpperCase() === "COMPLETED") {
                        const outputUrl = statusRes.data.download_signed_url;
                        clearInterval(interval);
                        setLoading(false);

                        if (outputUrl) {
                            setResultUrl(outputUrl);
                            setStatusMsg(
                                "✅ Hoàn tất! Bạn có thể xem kết quả bên dưới"
                            );
                        } else {
                            setErrorMsg(
                                "Task hoàn tất nhưng không có ảnh kết quả"
                            );
                        }
                    }

                    attempts++;
                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        setErrorMsg(
                            "Quá thời gian chờ xử lý. Vui lòng thử lại sau"
                        );
                        setLoading(false);
                        setStatusMsg("");
                    }
                } catch (err) {
                    console.error("Error checking status:", err);
                    clearInterval(interval);
                    setErrorMsg("Lỗi khi kiểm tra trạng thái xử lý");
                    setLoading(false);
                }
            }, 3000);
        } catch (err) {
            console.error("Lỗi tạo task:", err);
            setErrorMsg(
                "Không thể khởi tạo quá trình thử đồ. Vui lòng thử lại"
            );
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4 md:p-8">
            {/* Modal xem ảnh */}
            {viewImageModal.open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={closeImageModal}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">
                                {viewImageModal.title}
                            </h3>
                            <button
                                onClick={closeImageModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4 h-full overflow-auto flex justify-center">
                            <img
                                src={viewImageModal.url}
                                alt="Preview"
                                className="max-w-full max-h-[70vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div>
                    <Button
                        onClick={() => navigate("/cart")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition"
                    >
                        Back to Cart
                    </Button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Virtual Try-On AI
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Upload your photo and try on different outfits virtually
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Model Photo Upload Section */}
                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-gray-200 hover:border-pink-300 transition-colors rounded-xl bg-white p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="w-5 h-5 text-pink-600" />
                                <h2 className="font-semibold text-lg">
                                    Upload Model Photo
                                </h2>
                            </div>

                            {modelImages.length === 0 ? (
                                <div className="text-center py-8">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500 mb-4">
                                        Upload a photo of yourself or a model
                                    </p>
                                    <button
                                        onClick={triggerModelInput}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Choose Photo
                                    </button>
                                    <input
                                        ref={modelInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleModelUpload}
                                        className="hidden"
                                        multiple
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden group">
                                        <img
                                            src={
                                                modelImages[
                                                    selectedModelIndex || 0
                                                ].url
                                            }
                                            alt="Selected model"
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() =>
                                                openImageModal(
                                                    modelImages[
                                                        selectedModelIndex || 0
                                                    ].url,
                                                    "Model Photo"
                                                )
                                            }
                                        />
                                        <button
                                            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openImageModal(
                                                    modelImages[
                                                        selectedModelIndex || 0
                                                    ].url,
                                                    "Model Photo"
                                                );
                                            }}
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {modelImages.map((img, index) => (
                                            <div
                                                key={img.id}
                                                className="relative"
                                            >
                                                <div
                                                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                                                        selectedModelIndex ===
                                                        index
                                                            ? "border-pink-500"
                                                            : "border-transparent"
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedModelIndex(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={`Model ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeModelImage(index);
                                                    }}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={triggerModelInput}
                                        className="w-full py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Add More Photos
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Type Selection */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="font-semibold text-lg mb-4">
                                Garment Type
                            </h2>
                            <div className="relative">
                                <button
                                    className="w-full p-3 rounded-lg border border-gray-200 flex items-center justify-between"
                                    onClick={() =>
                                        setShowTypeDropdown(!showTypeDropdown)
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(clothType)}
                                        <span>{getTypeLabel(clothType)}</span>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${
                                            showTypeDropdown ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {showTypeDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        {(
                                            ["upper", "lower", "full"] as const
                                        ).map((type) => (
                                            <button
                                                key={type}
                                                className={`w-full p-3 text-left flex items-center gap-2 hover:bg-gray-50 ${
                                                    clothType === type
                                                        ? "bg-pink-50 text-pink-600"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    setClothType(type);
                                                    setShowTypeDropdown(false);
                                                }}
                                            >
                                                {getTypeIcon(type)}
                                                {getTypeLabel(type)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 text-sm text-gray-500">
                                {clothType === "upper" &&
                                    "Shirts, sweaters, jackets"}
                                {clothType === "lower" &&
                                    "Pants, skirts, shorts"}
                                {clothType === "full" &&
                                    "Dresses, jumpsuits, coats"}
                            </div>
                        </div>
                    </div>

                    {/* Clothing Items Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-lg">
                                    Clothing Collection
                                </h2>
                                <button
                                    onClick={triggerClothInput}
                                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:from-pink-600 hover:to-blue-600"
                                >
                                    Add Clothes
                                </button>
                                <input
                                    ref={clothInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleClothUpload}
                                    className="hidden"
                                    multiple
                                />
                            </div>

                            <div className="mb-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {sampleClothes.map((sample) => (
                                        <div
                                            key={sample.id}
                                            className="relative group cursor-pointer"
                                            onClick={() =>
                                                addSampleCloth(sample)
                                            }
                                        >
                                            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={sample.url}
                                                    alt={sample.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white px-2 py-1 rounded text-xs font-medium">
                                                    Add to collection
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-center truncate">
                                                {sample.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {clothImages.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Upload clothing items to get started</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {clothImages.map((img, index) => (
                                        <div
                                            key={img.id}
                                            className="relative group"
                                        >
                                            <div
                                                className={`aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-pointer ${
                                                    selectedClothIndex === index
                                                        ? "ring-4 ring-pink-300"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedClothIndex(index)
                                                }
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={`Clothing ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openImageModal(
                                                            img.url,
                                                            "Clothing Item"
                                                        );
                                                    }}
                                                >
                                                    <Maximize2 className="text-white w-6 h-6" />
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeClothImage(index);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-1 bg-white/80 rounded-full text-xs flex items-center gap-1">
                                                    {getTypeIcon(clothType)}
                                                    {clothType}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-center truncate">
                                                {img.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Try On Preview */}
                        {selectedModelIndex !== null &&
                            selectedClothIndex !== null && (
                                <div className="bg-gradient-to-br from-pink-50 to-blue-50 border-2 border-pink-200 rounded-xl p-6">
                                    <h2 className="text-center text-pink-700 font-semibold text-lg mb-6">
                                        Virtual Try-On Preview
                                    </h2>

                                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
                                        <div className="text-center">
                                            <h3 className="font-medium mb-2">
                                                Your Photo
                                            </h3>
                                            <div
                                                className="w-32 h-40 md:w-40 md:h-52 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
                                                onClick={() =>
                                                    openImageModal(
                                                        modelImages[
                                                            selectedModelIndex
                                                        ].url,
                                                        "Model Photo"
                                                    )
                                                }
                                            >
                                                <img
                                                    src={
                                                        modelImages[
                                                            selectedModelIndex
                                                        ].url
                                                    }
                                                    alt="Model"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Maximize2 className="text-white w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-2xl md:text-4xl text-pink-400">
                                            +
                                        </div>

                                        <div className="text-center">
                                            <h3 className="font-medium mb-2">
                                                Selected Item
                                            </h3>
                                            <div
                                                className="w-32 h-40 md:w-40 md:h-52 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
                                                onClick={() =>
                                                    openImageModal(
                                                        clothImages[
                                                            selectedClothIndex
                                                        ].url,
                                                        "Clothing Item"
                                                    )
                                                }
                                            >
                                                <img
                                                    src={
                                                        clothImages[
                                                            selectedClothIndex
                                                        ].url
                                                    }
                                                    alt="Clothing"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Maximize2 className="text-white w-6 h-6" />
                                                </div>
                                            </div>
                                            <span className="inline-block mt-2 px-2 py-1 bg-white rounded-full text-xs">
                                                {getTypeIcon(clothType)}
                                                {getTypeLabel(clothType)}
                                            </span>
                                        </div>

                                        <div className="text-2xl md:text-4xl text-pink-400">
                                            =
                                        </div>

                                        <div className="text-center">
                                            <h3 className="font-medium mb-2">
                                                Result
                                            </h3>
                                            <div className="w-32 h-40 md:w-40 md:h-52 bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg border-2 border-dashed border-pink-300 flex items-center justify-center">
                                                {resultUrl ? (
                                                    <div
                                                        className="w-full h-full cursor-pointer relative group"
                                                        onClick={() =>
                                                            openImageModal(
                                                                resultUrl,
                                                                "Try-On Result"
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={resultUrl}
                                                            alt="Try-on result"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Maximize2 className="text-white w-6 h-6" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <Camera className="w-6 h-6 md:w-8 md:h-8 mx-auto text-pink-400 mb-2" />
                                                        <p className="text-xs md:text-sm text-pink-600 font-medium">
                                                            {loading
                                                                ? "Processing..."
                                                                : "AI Processing"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center mt-6">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className={`px-6 py-2 md:px-8 md:py-3 rounded-lg text-white font-medium ${
                                                loading
                                                    ? "bg-gray-400"
                                                    : "bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                                            }`}
                                        >
                                            {loading
                                                ? "Processing..."
                                                : "Generate Try-On Result"}
                                        </button>
                                    </div>

                                    {statusMsg && (
                                        <div className="mt-4 p-2 text-center text-sm text-blue-600">
                                            {statusMsg}
                                        </div>
                                    )}
                                    {errorMsg && (
                                        <div className="mt-4 p-2 text-center text-sm text-red-600">
                                            {errorMsg}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dressing;
