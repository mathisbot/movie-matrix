import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  interface FAQProps {
    question: string;
    answer: string;
    value: string;
  }
  
  const FAQList: FAQProps[] = [
    {
      question: "Is MovieMatrix really free?",
      answer: "Yes. And it will always be.",
      value: "item-1",
    },
    {
      question: "Do you sell our data?",
      answer:
        "No! The only data we collect is the one you provide us with. We don't sell your data to anyone. We respect your privacy.",
      value: "item-2",
    },
    {
      question:
        "How do you make money then?",
      answer:
        "We don't. We are a non-profit organization. We are here to help you find the best movies and TV shows to watch.",
      value: "item-3",
    },
    {
      question: "How did you come up with such a wonderful website?",
      answer: "We didn't. We copied it from Netflix. Just kidding. We worked hard to make it as user-friendly as possible. We hope you like it.",
      value: "item-4",
    },
    {
      question:
        "How can I watch a movie on Movie Matrix?",
      answer:
        "You can't actually. We don't host any movies. We just help you find them. You can watch them on Netflix, Amazon Prime, Disney+, etc",
      value: "item-5",
    },
  ];
  
  export const FAQ = () => {
    return (
      <section
        id="faq"
        className="container py-24 sm:py-32"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Questions
          </span>
        </h2>
  
        <Accordion
          type="single"
          collapsible
          className="w-full AccordionRoot"
        >
          {FAQList.map(({ question, answer, value }: FAQProps) => (
            <AccordionItem
              key={value}
              value={value}
            >
              <AccordionTrigger className="text-left">
                {question}
              </AccordionTrigger>
  
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
  
        <h3 className="font-medium mt-4">
          Still have questions?{" "}
          <a
            rel="noreferrer noopener"
            href="mailto:support@ml.viarezo.fr"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Contact us
          </a>
        </h3>
      </section>
    );
  };