import { BaseModel, FindQueryParam, FindResponse, SearchFindRequest } from '@dilta/platform-shared';
import { sortBy } from 'lodash';
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';
import { preInsert, preUpdate } from './cleaner';

/** Query Constants for find query */
enum QUERY_CONSTANTS {
    skip = 0,
    limit = 10,
    sort = 'id',
}

/**
 * base class for all model must adhere to has an interface for interaction
 *
 */
export class ModelServiceBase<T extends Partial<BaseModel>> {
    constructor(
        public collection: Repository<T>,
    ) { }

    /**
     * to retrieve a single item
     *
     * @param {Partial<T>} query search params
     * @returns
     * @memberof ModelBase
     */
    async retrieve$(query: DeepPartial<T>) {
        const res = await this.collection.findOne(query as ObjectLiteral);
        return res;
    }

    /**
     * searchs for any items that matches the query defined
     *
     * @param {Partial<T>} query
     * @param {(FindQueryParam | boolean)} [custom] disable default custom params
     * @returns
     * @memberof ModelBase
     */
    find$(query: SearchFindRequest<T>, custom?: FindQueryParam) {
        let { limit, skip, sort } = QUERY_CONSTANTS as any;

        if (custom) {
            limit = custom.limit || limit;
            skip = custom.skip || skip;
            sort = custom.sort || sort;
        }
        const queryParams: FindQueryParam = { limit, skip, sort };
        if (typeof query === 'string') {
            return this.search(query, queryParams);
        }
        return this.find(query, queryParams);
    }

    /**
     * executes the search query
     *
     * @param {string} query
     * @param {FindQueryParam} { skip, limit }
     * @returns {FindResponse<T>}
     * @memberof ModelBase
     */
    async search(
        query: string,
        { skip, limit, sort }: FindQueryParam,
    ): Promise<FindResponse<T>> {
        const regx = new RegExp(`${query}`, 'i');
        const allDocs = await this.collection
            .find({});
        let matchDocs = allDocs.filter(e => regx.test(JSON.stringify(e)));
        if (sort) {
            matchDocs = sortBy(matchDocs, sort);
        }
        return {
            skip,
            limit,
            data: matchDocs.slice(skip, limit + skip),
            total: matchDocs.length,
        };
    }

    /**
     * executes the find query
     *
     * @param {Partial<T>} query
     * @param {FindQueryParam} { skip, limit }
     * @returns {FindResponse<T>}
     * @memberof ModelBase
     */
    async find(
        query: Partial<T>,
        { skip, limit, sort }: FindQueryParam = { skip: 0 } as any,
    ): Promise<FindResponse<T>> {
        let matchDocs = await this.collection
            .find(query as ObjectLiteral);
        if (sort) {
            matchDocs = sortBy(matchDocs, sort);
        }
        const total = matchDocs.length;
        return {
            skip,
            limit,
            total,
            data: matchDocs.slice(skip || 0, limit ? limit + skip : total),
        };
    }

    /**
     * creates a new one
     *
     */
    async update$(id: string, item: DeepPartial<T>) {
        const newItem = await this.collection.save(preUpdate(item));
        return newItem;
    }

    /**
     * creates a new item that matches
     *
     */
    async create$(item: DeepPartial<T>) {
        return await this.collection.save(preInsert(item));
    }

    /**
     * delete item that match the query
     *
     */
    async delete$(query: DeepPartial<T>) {
        const success = await this.collection
            .remove(await this.retrieve$(query));
        return success;
    }
}
