import StatisticsChart from "@/components/ui/Chhhart";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#003654] mb-4">Dashboard</h1>
      <div className="w-[100%] flex flex-row gap-32 space-y-4">    
<div className="">
<StatisticsChart />

</div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <span className="text-2xl font-bold">1000</span>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-[#003654]">Total Users</p>
              <p className="text-sm text-gray-500">Based on user data</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
              <span className="text-2xl font-bold">250</span>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-[#003654]">Paid Subscribers</p>
              <p className="text-sm text-gray-500">Total number of paid subscribers</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full">
              <span className="text-2xl font-bold">25.00%</span>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-[#003654]">Premium Percentage</p>
              <p className="text-sm text-gray-500">Percentage of premium users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
