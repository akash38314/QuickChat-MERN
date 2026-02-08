import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext'; 

const ProfilePage = () => {
    const { authUser, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    // Safe Initialization: Defaults to empty string to avoid uncontrolled input errors
    const [name, setName] = useState(authUser?.fullName || "");
    const [bio, setBio] = useState(authUser?.bio || "");
    const [selectedImg, setSelectedImg] = useState(null);
    const [previewImg, setPreviewImg] = useState("");

    // Effect for Image Preview & Memory Cleanup
    useEffect(() => {
        if (!selectedImg) return;
        
        const url = URL.createObjectURL(selectedImg);
        setPreviewImg(url);
        
        // Memory cleanup to prevent performance issues
        return () => URL.revokeObjectURL(url); 
    }, [selectedImg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Logic to handle update with or without a new image
        if (!selectedImg) {
            await updateProfile({ fullName: name, bio });
            navigate('/');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async () => {
            const base64Image = reader.result;
            await updateProfile({ profilePic: base64Image, fullName: name, bio });
            navigate('/');
        };
    };

    return (
        <div className='min-h-screen bg-[#1c1631] bg-[url("/bgImage.svg")] bg-contain flex items-center justify-center p-4 transition-all duration-500'>
            <div className='w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-500'>
                
                {/* Left Side: Professional Edit Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 md:p-14 flex-1">
                    <div className='mb-2'>
                        <h3 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h3>
                        <p className='text-gray-400 text-sm mt-1'>Update your personal identity and bio.</p>
                    </div>
                    
                    {/* Avatar Upload with Live Feedback */}
                    <label htmlFor="avatar" className='flex items-center gap-5 cursor-pointer group w-fit'>
                        <div className="relative">
                            <img 
                                src={previewImg || authUser?.profilePic || assets.avatar_icon} 
                                alt="preview" 
                                className='w-20 h-20 rounded-full object-cover border-2 border-violet-500 p-1 group-hover:brightness-75 transition-all shadow-lg'
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[12px] font-bold text-white bg-black/40 px-2 py-1 rounded-lg">EDIT</span>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <span className="text-gray-200 text-sm font-semibold group-hover:text-violet-400 transition-colors">Change Profile Photo</span>
                            <span className="text-gray-500 text-xs">JPG, PNG or JPEG (Max 2MB)</span>
                        </div>
                        <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                    </label>

                    <div className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Full Name</label>
                            <input 
                                onChange={(e) => setName(e.target.value)} 
                                value={name}
                                type="text" 
                                required 
                                className='p-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-600'
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">About Bio</label>
                            <textarea 
                                onChange={(e) => setBio(e.target.value)} 
                                value={bio} 
                                placeholder="Describe yourself..." 
                                required 
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all placeholder:text-gray-600" 
                                rows={4}
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="mt-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-purple-500/20 active:scale-[0.98] transition-all">
                        Update Profile
                    </button>
                </form>

                {/* Right Side: Identity Preview Card */}
                <div className="hidden md:flex flex-1 bg-black/20 items-center justify-center p-14 border-l border-white/5 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 blur-[100px] rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/20 blur-[100px] rounded-full"></div>
                    
                    <div className="text-center z-10">
                        <div className='relative inline-block'>
                            <img 
                                className='w-52 h-52 rounded-full object-cover border-4 border-violet-500/30 p-2 shadow-2xl transition-transform duration-700 hover:scale-105' 
                                src={previewImg || authUser?.profilePic || assets.avatar_icon} 
                                alt="large preview" 
                            />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-white tracking-tight">{name || "Your Name"}</h2>
                        <p className="text-gray-500 text-sm mt-2 italic max-w-[240px] mx-auto leading-relaxed border-t border-white/5 pt-4">
                            {bio || "Your story starts here..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage