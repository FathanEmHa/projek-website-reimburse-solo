export default function Input({ label, type = "text", value, onChange, ...props }) {
    return (
        <div className="flex flex-col space-y-1">
            {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
            )}
            <input 
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 
                   text-gray-900 placeholder-gray-400 bg-white"
                {...props}
            />
        </div>
    );
}