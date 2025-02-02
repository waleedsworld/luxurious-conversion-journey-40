import { useState, useEffect } from "react";

interface TypewriterTextProps {
  words: string[];
  delay?: number;
}

export const TypewriterText = ({ words, delay = 3000 }: TypewriterTextProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const typeSpeed = 100;
    const deleteSpeed = 50;

    const type = () => {
      const currentWord = words[currentWordIndex];
      
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
      } else {
        setText(currentWord.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
      }
    };

    const timer = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, currentWordIndex, words, delay]);

  return (
    <span className="text-secondary-DEFAULT font-bold">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
};