import ProductRow from "./components/ProductRow";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      <div className="max-w-3xl mx-auto text-2xl sm:text-5xl lg:text-6xl font-bold text-center">
        <h1>Find the best Tailwind</h1>
        <h1 className="text-primary">Templates & Icons</h1>
        <p className="text-base font-normal lg:text-lg text-muted-foreground mx-auto mt-5 w-[90%]">
          Elevate your digital products with our UI template and icon store. Discover a range of premium templates and customizable icons to create stunning visuals and seamless user experiences. 
        </p>
      </div>
      <ProductRow category="newest"/>
      <ProductRow category="templates"/>
      <ProductRow category="icons"/>
      <ProductRow category="uikits"/>
    </section>
  );
}
