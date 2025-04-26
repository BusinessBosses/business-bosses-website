import serviceApi from "../../../../services/serviceApi";
import { Project, ProjectStatus } from "../../tasks/models/projectsmodel";

class ShopController {
  // Existing methods

  async fetchShop(user: string) {
    const response = await serviceApi.fetch(`/shops/` + user);
    return response;
  }

  async fetchUserShop(user: string) {
    const response = await serviceApi.fetch(`/shops/user-shops/` + user);
    return response;
  }

  async addShop(data: any) {
    const response = await serviceApi.post(`/shops`, data);
    return response;
  }

  async updateShop(id: string, data: any) {
    // Updated to use PUT method for clarity on updating a resource
    const response = await serviceApi.update(`/shops/` + id, data);
    return response;
  }

  async fetchProducts(user: string) {
    const response = await serviceApi.fetch(`/goods/user-products/` + user);
    return response;
  }

  async fetchServices(user: string) {
    const response = await serviceApi.fetch(`/services/user-services/` + user);
    return response;
  }

  // ============================================================
  // New Methods (expanded functionality similar to the Dart code)
  // ============================================================

  // Initialize the current user's shop (returns the first shop if exists)
  async initShop(user: string) {
    const response = await serviceApi.fetch(`/shops/user-shops/` + user);
    if (response.success && response.data.rows && response.data.rows.length > 0) {
      return response.data.rows[0];
    }
    return null;
  }

  // Initialize shop data: fetch shop details, products, services,
  // custom items and suppliers, combine and sort items by createdAt.
  async initShopData(user: string) {
    const shopResp = await serviceApi.fetch(`/shops/user-shops/` + user);
    if (!shopResp.success || !shopResp.data.rows || shopResp.data.rows.length === 0) {
      return null;
    }
    const productsResp = await serviceApi.fetch(`/goods/user-products/` + user);
    const servicesResp = await serviceApi.fetch(`/services/user-services/` + user);
    const customItemsResp = await serviceApi.fetch(`/custom-items/user/` + user);
    const suppliersResp = await serviceApi.fetch(`/vendors/user/` + user);

    let items: any[] = [];
    if (productsResp.success && Array.isArray(productsResp.data.rows)) {
      items = items.concat(productsResp.data.rows);
    }
    if (servicesResp.success && Array.isArray(servicesResp.data.rows)) {
      items = items.concat(servicesResp.data.rows);
    }
    if (customItemsResp.success && Array.isArray(customItemsResp.data)) {
      items = items.concat(customItemsResp.data);
    }
    // Sort items by createdAt date descending
    items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      shop: shopResp.data.rows[0],
      products: productsResp.success ? productsResp.data.rows : [],
      services: servicesResp.success ? servicesResp.data.rows : [],
      customItems: customItemsResp.success ? customItemsResp.data : [],
      suppliers: suppliersResp.success ? suppliersResp.data.rows : [],
      items: items,
    };
  }

  /**
   * Fetches all projects for a user, groups them by status (including an "ALL" bucket),
   * and returns both the raw list and the grouped lists.
   */
  async initProjects(user: string): Promise<{
    projects: Project[];
    statusProjects: Record<ProjectStatus, Project[]>;
    allProjects: Project[];
  }> {
    const response = await serviceApi.fetch(`/projects/user-projects/${user}`);

    // Prepare defaults
    let projects: Project[] = [];
    const statusProjects: Record<ProjectStatus, Project[]> = {} as any;
    let allProjects: Project[] = [];

    if (response.success && Array.isArray(response.data.rows)) {
      // 1. Map raw rows into your Project type
      projects = response.data.rows.map((row: any): Project => ({
        id: row.id,
        userId: row.userId ?? row.user_id,
        name: row.name,
        amount: row.amount,
        status: row.status as ProjectStatus,
        createdAt: new Date(row.createdAt),
        startAt: new Date(row.startAt),
        endAt: new Date(row.endAt),
        description: row.description,
        duration: row.duration,
        shop: row.shop,
      }));

      // 2. Build a bucket for each status
      Object.values(ProjectStatus).forEach((status) => {
        if (status === ProjectStatus.ALL) {
          // "All" should contain every project
          statusProjects[status] = [...projects];
        } else {
          statusProjects[status] = projects.filter((p) => p.status === status);
        }
      });

      // 3. Flatten the buckets (excluding ALL) into one ordered list
      allProjects = Object.values(ProjectStatus)
        .filter((st) => st !== ProjectStatus.ALL)
        .reduce<Project[]>((acc, st) => acc.concat(statusProjects[st]), []);
    }

    return { projects, statusProjects, allProjects };
  }

  async addProject(data: any) {
    const response = await serviceApi.post(`/projects`, data);
    return response;
  }

  private mapStatusForApi(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.ALL:
        return "all projects";
      case ProjectStatus.TODO:
        return "to-do";
      case ProjectStatus.INPROGRESS:
        return "pending";
      case ProjectStatus.COMPLETED:
        return "completed";
    }
  }

  async updateProject(id: any, data: any) {
    if (data.status !== undefined) {
      data.status = this.mapStatusForApi(data.status);
    }
    const response = await serviceApi.update(`/projects/` + id, data);
    console.log(response);
    
    return response;
  }

  // Initialize a specific user's shop,
  // update its view count, and fetch products, services and custom items.
  async initUserShop(user: string) {
    const response = await serviceApi.fetch(`/shops/user-shops/` + user);
    let userShop = null;
    if (response.success && response.data.rows && response.data.rows.length > 0) {
      userShop = response.data.rows[0];
      // Update view count by incrementing the current views.
      const updatedViews = userShop.views + 1;
      await serviceApi.update(`/shops/` + userShop.id, { views: updatedViews });
    } else {
      return null;
    }
    const productsResp = await serviceApi.fetch(`/goods/user-products/` + user);
    const servicesResp = await serviceApi.fetch(`/services/user-services/` + user);
    const customItemsResp = await serviceApi.fetch(`/custom-items/user/` + user);

    let userItems: any[] = [];
    if (productsResp.success && Array.isArray(productsResp.data.rows)) {
      userItems = userItems.concat(productsResp.data.rows);
    }
    if (servicesResp.success && Array.isArray(servicesResp.data.rows)) {
      userItems = userItems.concat(servicesResp.data.rows);
    }
    if (customItemsResp.success && Array.isArray(customItemsResp.data)) {
      userItems = userItems.concat(customItemsResp.data);
    }
    // Sort combined items by createdAt date descending
    userItems.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      userShop,
      userProducts: productsResp.success ? productsResp.data.rows : [],
      userServices: servicesResp.success ? servicesResp.data.rows : [],
      userCustomItems: customItemsResp.success ? customItemsResp.data : [],
      userItems: userItems,
    };
  }

  // -------------------
  // Product Methods
  // -------------------

  async addProduct(data: any) {
    const response = await serviceApi.post(`/goods`, data);
    return response;
  }

  async updateProduct(id: number, data: any) {
    const response = await serviceApi.update(`/goods/` + id, data);
    return response;
  }

  async deleteProduct(id: number) {
    const response = await serviceApi.remove(`/goods/` + id);
    return response;
  }

  // -------------------
  // Service Methods
  // -------------------

  async addService(data: any) {
    const response = await serviceApi.post(`/services`, data);
    return response;
  }

  async updateService(id: number, data: any) {
    const response = await serviceApi.update(`/services/` + id, data);
    return response;
  }

  async deleteService(id: number) {
    const response = await serviceApi.remove(`/services/` + id);
    return response;
  }

  // -------------------
  // Custom Item Methods
  // -------------------

  async addCustomItem(data: any) {
    const response = await serviceApi.post(`/custom-items`, data);
    return response;
  }

  async updateCustomItem(id: number, data: any) {
    const response = await serviceApi.update(`/custom-items/` + id, data);
    return response;
  }

  async deleteCustomItem(id: number) {
    const response = await serviceApi.remove(`/custom-items/` + id);
    return response;
  }

  // -------------------
  // Supplier (Vendor) Methods
  // -------------------

  async addSupplier(data: any) {
    const response = await serviceApi.post(`/vendors`, data);
    return response;
  }

  async updateSupplier(id: string, data: any) {
    const response = await serviceApi.update(`/vendors/` + id, data);
    return response;
  }

  async deleteSupplier(id: string) {
    const response = await serviceApi.remove(`/vendors/` + id);
    return response;
  }

  // -------------------
  // Earnings & Sharing
  // -------------------

  async shareEarn(postId: any, type: string, userId: string) {
    const data = {
      postId,
      userId,
      timestamp: Date.now(),
      type,
    };
    const response = await serviceApi.post(`/coins/listing`, data);
    return response;
  }

  // -------------------
  // Dashboard and Statistics Methods
  // -------------------

  // Load order data for a shop; optional query param "date"
  async loadOrderData(shopId: string, date?: string) {
    let path = `/dashboard/shop-orders/` + shopId;
    if (date) {
      path += `?date=` + date;
    }
    const response = await serviceApi.fetch(path);
    return response;
  }

  // Load shop statistics data for a user
  async loadShopData(userId: string) {
    const response = await serviceApi.fetch(`/dashboard/shop-statistics/` + userId);
    return response;
  }

  // Load shop graph data; optional query param "date"
  async loadShopGraph(shopId: string, date?: string) {
    let path = `/dashboard/shop-graph-data/` + shopId;
    if (date) {
      path += `?date=` + date;
    }
    const response = await serviceApi.fetch(path);
    return response;
  }

  // Filter dashboard data based on a given date (or "all_time")
  async filterData(shopId: string, date: string) {
    let orderData, graphData;
    if (date === "all_time") {
      orderData = await this.loadOrderData(shopId);
      graphData = await this.loadShopGraph(shopId);
    } else {
      orderData = await this.loadOrderData(shopId, date);
      graphData = await this.loadShopGraph(shopId, date);
    }
    return { orderData, graphData };
  }

  // Aggregate statistics: order data, shop data and shop graph data
  async loadStatistics(shopId: string, userId: string, date?: string) {
    const orderData = await this.loadOrderData(shopId, date);
    const shopData = await this.loadShopData(userId);
    const shopGraph = await this.loadShopGraph(shopId, date);
    return { orderData, shopData, shopGraph };
  }
}

export default new ShopController();
