<template>
  <aside
  class="w-80 h-auto"
  style="background-color: #2D4A5A;
  color: #ffffff;"
>

    <div class="h-16 flex items-center px-6 border-b">
      <h1
      class="text-base font-semibold"
      style="color: #bcf7d9;"
      >
        ♜ Strongchess POS
      </h1>
    </div>

    <nav class="p-4 space-y-2">

      <RouterLink
        to="/"
        class="block p-3 rounded-lg hover:bg-slate-100 hover:text-[#000000]"
      >
        Dashboard
      </RouterLink>

      <RouterLink
        to="/products"
        class="block p-3 rounded-lg hover:bg-slate-100 hover:text-[#000000]"
      >
        Products
      </RouterLink>

      <RouterLink
        to="/inventory"
        class="block p-3 rounded-lg hover:bg-slate-100 hover:text-[#000000]"
      >
        Inventory
      </RouterLink>

      <RouterLink
        to="/sales"
        class="block p-3 rounded-lg hover:bg-slate-100 hover:text-[#000000]"
      >
        Sales
      </RouterLink>

      <RouterLink
        to="/customers"
        class="block p-3 rounded-lg hover:bg-slate-100 hover:text-[#000000]"
      >
        Customers
      </RouterLink>

      <RouterLink
        to="/reports"
        class="block p-3 rounded-lg hover:bg-slate-100 hover:text-[#000000]"
      >
        Reports
      </RouterLink>

    </nav>

  </aside>
</template>