import React from 'react';
import { DollarSignIcon, UsersIcon, PackageIcon } from 'lucide-react';
import { CostSummary } from '@/utils/calculateTotalCost';
import { formatCurrency} from '../../../utils/formatCurrency';
import { DetailItem } from './detailItem';

interface CostSummaryCardProps {
    costSummary: CostSummary;
    travelerCount: number;
}

export const CostSummaryCard: React.FC<CostSummaryCardProps> = ({ costSummary, travelerCount }) => (
    <div className="lg:col-span-1 p-6 bg-blue-50 rounded-xl shadow-2xl border-4 border-blue-200 h-fit space-y-4">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-3">
            <DollarSignIcon className="w-5 h-5 mr-2" />
            Costo
        </h4>

        <div className="space-y-1">
            <DetailItem
                label={`Vuelos (${travelerCount})`}
                value={formatCurrency(costSummary.baseFlight)}
                icon={<UsersIcon className="w-4 h-4 text-indigo-500" />}
            />

            {costSummary.pets > 0 && (
                <DetailItem
                    label="Costo por Mascotas"
                    value={formatCurrency(costSummary.pets)}
                    icon={<PackageIcon className="w-4 h-4 text-pink-500" />}
                />
            )}

            {costSummary.luggage > 0 && (
                <DetailItem
                    label="Costo por Equipaje Extra"
                    value={formatCurrency(costSummary.luggage)}
                    icon={<PackageIcon className="w-4 h-4 text-orange-500" />}
                />
            )}
        </div>

        <div className="pt-6 border-t-2 border-blue-300">
            <div className="flex justify-between items-center flex-col items-start space-y-2">
                <span className="text-xl font-bold text-blue-900">Total a Pagar:</span>
                <span className="text-3xl font-extrabold text-blue-900">{formatCurrency(costSummary.total)}</span>
            </div>
        </div>
    </div>
);