
interface InputProps{
    type: string;
    placeholder: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    value?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

const InputField = ({ type, placeholder, Icon, value, onChange}: InputProps) => {
  return (
      <div className="relative w-full mb-6">
          <Icon className="w-6 h-6 text-gray-800 absolute left-3 inset-y-0 my-auto" />
          <input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="w-full pl-12 pr-3 py-2 bg-white text-gray-800 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
      </div>
  )
}

export default InputField