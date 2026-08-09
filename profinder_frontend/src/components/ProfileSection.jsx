// ProfileSection.jsx
import { useSelector } from "react-redux";

const ProfileSection = () => {
  const userData = useSelector((state) => state.auth.userData);
  const isRecruiter = useSelector((state) => state.auth.isRecruiter);

  if (!userData) return null;

  const renderSkillsSection = () => (
    <div className="my-3 flex flex-wrap gap-2">
      {userData.skills?.map((item, idx) => (
        <span
          key={idx}
          className="py-1 px-2 bg-blue-600 text-white text-xs rounded-full"
        >
          {item}
        </span>
      ))}
    </div>
  );

  const renderRecruiterSection = () => (
    <div className="my-3">
      <h3 className="text-gray-100 font-medium">
        Recruiter @ <span className="font-semibold">{userData.company}</span>
        <span className="ml-3 text-gray-300 text-sm">{userData.location}</span>
      </h3>
    </div>
  );

  return (
    <div>
      <h1 className="text-gray-100 text-2xl font-bold">Your Profile</h1>

      <div className="p-4 my-4 border rounded-lg bg-gray-900 text-gray-100">
        <div className="flex justify-between font-semibold">
          <h2 className="text-lg">{userData.name}</h2>
          <h2 className="text-gray-300">{userData.email}</h2>
        </div>

        {isRecruiter ? renderRecruiterSection() : renderSkillsSection()}
      </div>
    </div>
  );
};

export default ProfileSection;
