export default function Footer() {
  return (
    <footer className="bg-blue-100 mt-12 border-t">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* How Can We Help */}
        <div>
          <h3 className="font-semibold mb-3">How Can We Help?</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-500">Adopt a pet</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">Rehome a pet</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">Adopt FAQ’s</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">Rehome FAQ’s</a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">📍 123 Main Street, Anytown, USA</p>
          <p className="text-sm">📞 +880 17 3020 6297</p>
          <p className="text-sm">✉️ petpal@gmail.com</p>
        </div>

        {/* Keep in Touch */}
        <div>
          <h3 className="font-semibold mb-3">Keep in Touch With Us</h3>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="E-mail Address"
              className="border px-3 py-2 rounded w-48"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center py-4 text-sm text-black-500 bg-blue-400">
        © 2025 PetPal – All rights reserved.
      </div>
    </footer>
  );
}
