import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [image, setImage] = useState(user?.image || "");

  const handleSave = () => {
    updateUser({
      name,
      email,
      phone,
      dob,
      gender,
      image
    });
    toast.success("Profile updated successfully!");
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </Button>
        <h1 className="font-display text-lg font-bold">Edit Profile</h1>
      </div>

      <div className="px-4 mt-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/20">
            {image ? (
              <img src={image} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-muted-foreground text-3xl font-display font-medium">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </span>
            )}
            <label htmlFor="photo-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" size={24} />
            </label>
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }} 
            />
          </div>
          <label htmlFor="photo-upload" className="mt-2 text-sm text-primary font-medium cursor-pointer inline-block">
            Change Photo
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g., John Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g., john@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Mobile Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g., +1 234 567 8900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full mt-8 rounded-xl h-12">
          <Save size={18} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfilePage;
