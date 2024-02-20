import { useState } from 'react';

export default function MessageForm({setMessageReadStatus}) {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 128;
                    const maxHeight = 135;
                    canvas.width = maxWidth;
                    canvas.height = maxHeight;
                    const ctx = canvas.getContext('2d');
    
                    // Calculate the best aspect ratio
                    let sourceWidth = img.width;
                    let sourceHeight = img.height;
                    const targetRatio = maxWidth / maxHeight;
                    const sourceRatio = sourceWidth / sourceHeight;
                    let drawWidth = sourceWidth;
                    let drawHeight = sourceHeight;
    
                    if (sourceRatio > targetRatio) {
                        // Source is wider than the target
                        drawHeight = sourceHeight;
                        drawWidth = sourceHeight * targetRatio;
                    } else {
                        // Source is taller than the target
                        drawWidth = sourceWidth;
                        drawHeight = sourceWidth / targetRatio;
                    }
    
                    // Calculate the centering position
                    const startX = (sourceWidth - drawWidth) / 2;
                    const startY = (sourceHeight - drawHeight) / 2;
    
                    // Draw the image with the new dimensions
                    ctx.drawImage(img, startX, startY, drawWidth, drawHeight, 0, 0, maxWidth, maxHeight);
    
                    // Convert canvas to JPEG URL
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    setPreviewUrl(dataUrl);
                    setImage(dataUrl);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            image_data: image,
            text_data: message,
        };

        try {
            const response = await fetch('https://lovebox2-server-8d8e33f8d8e3.herokuapp.com/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Submission successful', data);
            setMessageReadStatus(false);

            // Reset form and state if needed
            setImage(null);
            setMessage('');
            setPreviewUrl('');
            e.target.reset();
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
        <div>
           <h1 className="text-center text-2xl font-bold">Upload Image and Write A Message</h1>
           <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4"
                    />
                </div>
                {previewUrl && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image preview</label>
                        <img src={previewUrl} alt="Preview" className="mt-1" />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        onChange={handleMessageChange}
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        placeholder="Write a message..."
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
