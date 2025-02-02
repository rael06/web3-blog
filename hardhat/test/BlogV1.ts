import { expect } from "chai";
import hre from "hardhat";
import { BlogV1 } from "../typechain-types";

describe("Blog Upgradeable Contract", function () {
  let blog: BlogV1;
  let owner: any, addr1: any, addr2: any;
  const cid1 = "QmHash1";
  const cid2 = "QmHash2";
  const cid3 = "QmHash3";

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    const BlogV1 = await hre.ethers.getContractFactory("BlogV1");
    const proxy = await hre.upgrades.deployProxy(BlogV1, [owner.address], {
      initializer: "initialize",
    });

    await proxy.waitForDeployment();
    blog = proxy as BlogV1;
  });

  it("Should create a post with correct data", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    const post = await blog.getPost(1);

    expect(post.id).to.equal(1);
    expect(post.cid).to.equal(cid1);
    expect(post.author).to.equal(addr1.address);
    expect(post.category).to.equal("Tech");
    expect(post.isPublished).to.equal(true);
    expect(post.isDeleted).to.equal(false);
  });

  it("Should allow author and owner to update post", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    await blog.connect(addr1).updatePost(1, cid2, false, "AI");

    let post = await blog.getPost(1);
    expect(post.cid).to.equal(cid2);
    expect(post.category).to.equal("AI");
    expect(post.isPublished).to.equal(false);

    await blog.connect(owner).updatePost(1, cid3, true, "Blockchain");

    post = await blog.getPost(1);
    expect(post.cid).to.equal(cid3);
    expect(post.category).to.equal("Blockchain");
    expect(post.isPublished).to.equal(true);
  });

  it("Should prevent non-author from updating a post", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    await expect(
      blog.connect(addr2).updatePost(1, cid2, false, "AI")
    ).to.be.revertedWith("Not authorized to update");
  });

  it("Should allow author and owner to delete post", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    await blog.connect(addr1).deletePost(1);
    let post = await blog.getPost(1);
    expect(post.isDeleted).to.equal(true);

    await blog.connect(addr1).createPost(cid2, "AI");
    await blog.connect(owner).deletePost(2);
    post = await blog.getPost(2);
    expect(post.isDeleted).to.equal(true);
  });

  it("Should retrieve paginated posts in normal order", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    await blog.connect(addr1).createPost(cid2, "Tech");
    await blog.connect(addr1).createPost(cid3, "AI");

    const [posts, nextStartIndex, hasMore, totalPosts] =
      await blog.getPostsPaginated(
        0,
        2,
        false,
        hre.ethers.ZeroAddress,
        "",
        0,
        0
      );

    expect(posts.length).to.equal(2);
    expect(posts[0]?.cid).to.equal(cid1);
    expect(posts[1]?.cid).to.equal(cid2);
    expect(nextStartIndex).to.equal(2);
    expect(hasMore).to.equal(true);
    expect(totalPosts).to.equal(3);
  });

  it("Should retrieve paginated posts in reverse order", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    await blog.connect(addr1).createPost(cid2, "Tech");
    await blog.connect(addr1).createPost(cid3, "AI");

    const [posts, nextStartIndex, hasMore, totalPosts] =
      await blog.getPostsPaginated(
        0,
        2,
        true,
        hre.ethers.ZeroAddress,
        "",
        0,
        0
      );

    expect(posts.length).to.equal(2);
    expect(posts[0]?.cid).to.equal(cid3);
    expect(posts[1]?.cid).to.equal(cid2);
    expect(nextStartIndex).to.equal(2);
    expect(hasMore).to.equal(true);
    expect(totalPosts).to.equal(3);
  });

  it("Should filter posts by author", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    await blog.connect(addr2).createPost(cid2, "AI");

    const [posts] = await blog.getPostsPaginated(
      0,
      10,
      false,
      addr1.address,
      "",
      0,
      0
    );

    expect(posts.length).to.equal(1);
    expect(posts[0]?.author).to.equal(addr1.address);
  });

  it("Should filter posts by category", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");
    await blog.connect(addr1).createPost(cid2, "AI");
    await blog.connect(addr1).createPost(cid3, "Tech");

    const [posts] = await blog.getPostsPaginated(
      0,
      10,
      false,
      hre.ethers.ZeroAddress,
      "Tech",
      0,
      0
    );

    expect(posts.length).to.equal(2);
    expect(posts[0]?.category).to.equal("Tech");
    expect(posts[1]?.category).to.equal("Tech");
  });

  it("Should filter posts by timestamp", async function () {
    await blog.connect(addr1).createPost(cid1, "Tech");

    await hre.network.provider.send("evm_increaseTime", [10]);
    await hre.network.provider.send("evm_mine");

    await blog.connect(addr1).createPost(cid2, "AI");

    const block2 = await hre.ethers.provider.getBlock("latest");
    const timestampSecondPost = block2!.timestamp;

    const [posts] = await blog.getPostsPaginated(
      0,
      10,
      false,
      hre.ethers.ZeroAddress,
      "",
      timestampSecondPost,
      0
    );

    expect(posts.length).to.equal(1);
    expect(posts[0]?.cid).to.equal(cid2);
  });
});
