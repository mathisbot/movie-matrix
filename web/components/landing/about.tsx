import { Statistics } from "./statistics";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                MovieMatrix
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                MovieMatrix is a project made in a week by a team of 3
                Engineering students at CentaleSupélec. The goal was to create a
                website that would help users find movies to watch based on
                their preferences.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
