
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <textarea
      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] text-sm sm:text-base resize-y"
      {...props}
    />
  );
};

export default TextArea;