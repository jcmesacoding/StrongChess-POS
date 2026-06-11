<script setup>
import { ref, onMounted } from 'vue'
import productService from '../services/productService'
import categoryService from '../services/categoryService'
import providerService from '../services/providerService'

const products = ref([])
const categories = ref([])
const providers = ref([])
const isEditing = ref(false)
const editingId = ref(null)
const toast = ref("")
const toastType = ref("")
const showDeleteModal = ref(false)
const productToDelete = ref(null)

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  newProduct.value = {
    name: '', description: '', salePrice: 0, purchasePrice: 0,
    currentStock: 0, minStock: 0, maxStock: 0, categoryId: null, providerId: null
  }
}

const showToast = (message, type) => {
  toast.value = message
  toastType.value = type
  setTimeout(() => { toast.value = "" }, 3000)
}

const confirmDelete = (id) => {
  productToDelete.value = id
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  try {
    await productService.delete(productToDelete.value)
    await loadProducts()
    showDeleteModal.value = false
    showToast("Product deleted successfully", "success")
  } catch (error) {
    showToast("Error deleting product", "error")
  }
}

const getCategoryName = (id) => {
  const category = categories.value.find(c => c.id === id)
  return category ? category.name : id
}

const loadProducts = async () => {
  try {
    const response = await productService.getAll()
    products.value = response.data
  } catch (error) {
    console.error("Error:", error)
  }
}

const loadCategories = async () => {
  try {
    const response = await categoryService.getAll()
    categories.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const loadProviders = async () => {
  try {
    const response = await providerService.getAll()
    providers.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const editProduct = (product) => {
  isEditing.value = true
  editingId.value = product.id
  newProduct.value = {
    name: product.name, description: product.description,
    salePrice: product.salePrice, purchasePrice: product.purchasePrice,
    currentStock: product.currentStock, minStock: product.minStock,
    maxStock: product.maxStock, categoryId: product.categoryId,
    providerId: product.providerId
  }
  showModal.value = true
}

const showModal = ref(false)

const newProduct = ref({
  name: '', description: '', salePrice: 0, purchasePrice: 0,
  currentStock: 0, minStock: 0, maxStock: 0, categoryId: null, providerId: null
})

const saveProduct = async () => {
  try {
    if (isEditing.value) {
      await productService.update(editingId.value, newProduct.value)
    } else {
      await productService.create(newProduct.value)
    }
    await loadProducts()
    closeModal()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
  loadProviders()
})
</script>

<template>
  <div class="space-y-4 lg:space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-[#213141]">Products</h1>
        <p class="text-gray-600 text-sm lg:text-base">Manage your inventory products</p>
      </div>
      <button @click="showModal = true"
        class="px-3 py-2 lg:px-5 lg:py-3 rounded-xl text-white font-medium transition hover:opacity-90 text-sm lg:text-base"
        style="background-color: #213141;">
        + Add Product
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Total Products</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141]">{{ products.length }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Low Stock</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-orange-500">
          {{ products.filter(p => p.currentStock <= p.minStock).length }}
        </h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Categories</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141]">{{ categories.length }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Out of Stock</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-red-500">
          {{ products.filter(p => p.currentStock === 0).length }}
        </h2>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search product..."
          class="flex-1 border rounded-lg px-4 py-2 text-sm" />
        <select class="border rounded-lg px-4 py-2 text-sm">
          <option>All Categories</option>
          <option>Boards</option>
          <option>Clocks</option>
          <option>Books</option>
          <option>Accessories</option>
        </select>
      </div>
    </div>

    <!-- Products Table (desktop) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="border-b" style="background-color: #bef1dd;">
          <tr>
            <th class="text-left px-6 py-4">SKU</th>
            <th class="text-left px-6 py-4">Product</th>
            <th class="text-left px-6 py-4">Category</th>
            <th class="text-left px-6 py-4">Price</th>
            <th class="text-left px-6 py-4">Stock</th>
            <th class="text-left px-6 py-4">Status</th>
            <th class="text-left px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4">{{ product.id }}</td>
            <td class="px-6 py-4">{{ product.name }}</td>
            <td class="px-6 py-4">{{ getCategoryName(product.categoryId) }}</td>
            <td class="px-6 py-4">${{ product.salePrice }}</td>
            <td class="px-6 py-4">{{ product.currentStock }}</td>
            <td class="px-6 py-4">
              <span v-if="product.currentStock === 0"
                class="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">Out of Stock</span>
              <span v-else-if="product.currentStock <= product.minStock"
                class="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">Low Stock</span>
              <span v-else
                class="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">Active</span>
            </td>
            <td class="px-6 py-4">
              <button class="mr-3" @click="editProduct(product)">✏️</button>
              <button @click="confirmDelete(product.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Products Cards (mobile) -->
    <div class="lg:hidden space-y-3">
      <div v-for="product in products" :key="product.id"
        class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="font-semibold text-[#213141]">{{ product.name }}</p>
            <p class="text-sm text-gray-500">{{ getCategoryName(product.categoryId) }}</p>
          </div>
          <span v-if="product.currentStock === 0"
            class="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Out of Stock</span>
          <span v-else-if="product.currentStock <= product.minStock"
            class="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Low Stock</span>
          <span v-else
            class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Active</span>
        </div>
        <div class="flex justify-between items-center text-sm text-gray-600">
          <span>Price: <strong>${{ product.salePrice }}</strong></span>
          <span>Stock: <strong>{{ product.currentStock }}</strong></span>
          <div>
            <button class="mr-3" @click="editProduct(product)">✏️</button>
            <button @click="confirmDelete(product.id)">🗑️</button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Add/Edit Product Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl lg:text-2xl font-bold text-[#213141]">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </h2>
        <button @click="closeModal" class="text-2xl">✕</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-medium text-sm">Name</label>
          <input v-model="newProduct.name" class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Description</label>
          <input v-model="newProduct.description" class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Sale Price</label>
          <input type="number" v-model="newProduct.salePrice" class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Purchase Price</label>
          <input type="number" v-model="newProduct.purchasePrice" class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Current Stock</label>
          <input type="number" v-model="newProduct.currentStock" class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Min Stock</label>
          <input type="number" v-model="newProduct.minStock" class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Max Stock</label>
          <input type="number" v-model="newProduct.maxStock" class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Category</label>
          <select v-model="newProduct.categoryId" class="w-full border rounded-lg px-3 py-2 text-sm">
            <option disabled value="">Select Category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Provider</label>
          <select v-model="newProduct.providerId" class="w-full border rounded-lg px-3 py-2 text-sm">
            <option disabled value="">Select Provider</option>
            <option v-for="provider in providers" :key="provider.id" :value="provider.id">
              {{ provider.companyName }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button @click="closeModal" class="px-5 py-2 rounded-lg border text-sm">Cancel</button>
        <button @click="saveProduct" class="px-5 py-2 rounded-lg text-white text-sm"
          style="background-color:#213141">
          {{ isEditing ? 'Update Product' : 'Save Product' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <h2 class="text-xl font-bold text-[#213141] mb-4">Delete Product</h2>
      <p class="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
      <div class="flex justify-end gap-3">
        <button @click="showDeleteModal = false" class="px-4 py-2 border rounded-lg">Cancel</button>
        <button @click="deleteProduct" class="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div v-if="toast" class="fixed top-5 right-5 px-5 py-3 rounded-xl text-white shadow-lg z-50"
    :class="toastType === 'success' ? 'bg-green-600 opacity-90' : 'bg-red-600'">
    {{ toast }}
  </div>
</template>