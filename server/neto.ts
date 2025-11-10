interface NetoAPIResponse {
  Item?: NetoProduct[];
  CurrentTime?: string;
  Ack?: string;
  Messages?: {
    Error?: Array<{ Message: string; SeverityCode: string }>;
    Warning?: Array<{ Message: string; SeverityCode: string }>;
  };
}

interface NetoProduct {
  ID: string;
  SKU: string;
  Name: string;
  Brand?: string;
  Model?: string;
  DefaultPrice?: number;
  RRP?: number;
  PromotionPrice?: number;
  PrimarySupplier?: string;
  Approved?: boolean;
  IsActive?: boolean;
  ShortDescription?: string;
  Description?: string;
  Images?: Array<{ URL: string }>;
  Categories?: Array<{ CategoryID: string; CategoryName: string }>;
  Variations?: NetoVariation[];
  VariantInventoryIDs?: number[];
}

interface NetoVariation {
  VariationID: string;
  Name: string;
  SKU: string;
  CurrentStockLevel?: number;
  Price?: number;
  RRP?: number;
}

export class NetoAPI {
  private apiKey: string;
  private storeDomain: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NETO_API_KEY || '';
    this.storeDomain = process.env.NETO_API_USERNAME || '';
    this.baseUrl = `https://${this.storeDomain}/do/WS/NetoAPI`;

    if (!this.apiKey || !this.storeDomain) {
      throw new Error('NETO_API_KEY and NETO_API_USERNAME must be set');
    }
  }

  async getProducts(filter: {
    SKU?: string;
    Name?: string;
    Brand?: string;
    Model?: string;
    Limit?: number;
    Page?: number;
  }): Promise<NetoProduct[]> {
    const requestBody = {
      Filter: {
        ...filter,
        OutputSelector: [
          'ID',
          'SKU',
          'Name',
          'Brand',
          'Model',
          'DefaultPrice',
          'RRP',
          'PromotionPrice',
          'ShortDescription',
          'Description',
          'Images',
          'Categories',
          'PrimarySupplier',
          'Approved',
          'IsActive'
        ]
      }
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'NETOAPI_ACTION': 'GetItem',
          'NETOAPI_KEY': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Neto API error: ${response.status} - ${errorText}`);
      }

      const data: NetoAPIResponse = await response.json();

      if (data.Messages?.Error && data.Messages.Error.length > 0) {
        throw new Error(`Neto API error: ${data.Messages.Error[0].Message}`);
      }

      return data.Item || [];
    } catch (error) {
      console.error('Error fetching from Neto API:', error);
      throw error;
    }
  }

  async getProductByName(name: string): Promise<NetoProduct[]> {
    return this.getProducts({ Name: name, Limit: 50 });
  }

  async getProductBySKU(sku: string): Promise<NetoProduct | null> {
    const products = await this.getProducts({ SKU: sku, Limit: 1 });
    return products.length > 0 ? products[0] : null;
  }
}

export const netoAPI = new NetoAPI();
