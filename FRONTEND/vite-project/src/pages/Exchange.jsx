import { useEffect, useState } from "react";
import API from "../api/axios";

function Exchange() {
  const [exchanges, setExchanges] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");

  const fetchExchanges = async () => {
    try {
      const res = await API.get("/exchange");
      setExchanges(res.data.exchanges || []);
    } catch (error) {
      console.error("Error fetching exchanges:", error);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const getUserId = () => {
    // Get user ID from localStorage or context
    return localStorage.getItem("userId");
  };

  const incoming = exchanges.filter(
    (ex) => ex.receiver?._id === getUserId()
  );

  const outgoing = exchanges.filter(
    (ex) => ex.requester?._id === getUserId()
  );

  const handleAction = async (id, status) => {
    try {
      await API.patch(`/exchange/${id}`, { status });
      fetchExchanges();
    } catch (error) {
      console.error("Error updating exchange:", error);
    }
  };

  return (
    <div className="p-6 bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <h2 className="text-xl font-bold mb-4">Exchange Requests</h2>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`px-4 py-2 rounded font-medium transition ${
            activeTab === "incoming"
              ? "bg-blue-500 text-white"
              : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
          }`}
        >
          Incoming ({incoming.length})
        </button>

        <button
          onClick={() => setActiveTab("outgoing")}
          className={`px-4 py-2 rounded font-medium transition ${
            activeTab === "outgoing"
              ? "bg-blue-500 text-white"
              : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
          }`}
        >
          Outgoing ({outgoing.length})
        </button>
      </div>

      {/* Exchange Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "incoming" ? (
          incoming.length > 0 ? (
            incoming.map((exchange) => (
              <div
                key={exchange._id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="mb-3">
                  <p className="font-semibold text-lg">
                    {exchange.requester?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    @{exchange.requester?.username}
                  </p>
                </div>

                <div className="bg-[var(--bg)] rounded p-3 mb-3">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    They offer
                  </p>
                  <p className="font-medium">
                    {exchange.requester?.skill || "Unknown Skill"}
                  </p>
                </div>

                <div className="bg-[var(--bg)] rounded p-3 mb-3">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    You offer
                  </p>
                  <p className="font-medium">
                    {exchange.receiver?.skill || "Unknown Skill"}
                  </p>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Status: <span className="font-semibold">{exchange.status}</span>
                </p>

                {exchange.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(exchange._id, "accepted")}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(exchange._id, "rejected")}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-[var(--text-secondary)]">
              No incoming exchange requests
            </div>
          )
        ) : outgoing.length > 0 ? (
          outgoing.map((exchange) => (
            <div
              key={exchange._id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="mb-3">
                <p className="font-semibold text-lg">
                  {exchange.receiver?.name || "Unknown User"}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  @{exchange.receiver?.username}
                </p>
              </div>

              <div className="bg-[var(--bg)] rounded p-3 mb-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">
                  You offer
                </p>
                <p className="font-medium">
                  {exchange.requester?.skill || "Unknown Skill"}
                </p>
              </div>

              <div className="bg-[var(--bg)] rounded p-3 mb-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">
                  They offer
                </p>
                <p className="font-medium">
                  {exchange.receiver?.skill || "Unknown Skill"}
                </p>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                Status:{" "}
                <span className={`font-semibold ${
                  exchange.status === "accepted" ? "text-green-500" :
                  exchange.status === "rejected" ? "text-red-500" : "text-yellow-500"
                }`}>
                  {exchange.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-[var(--text-secondary)]">
            No outgoing exchange requests
          </div>
        )}
      </div>
    </div>
  );
}

export default Exchange;
